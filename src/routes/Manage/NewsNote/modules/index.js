import { message } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const NEWSNOTE_SEARCH_REQUEST = 'NEWSNOTE_SEARCH_REQUEST';
const NEWSNOTE_SEARCH_SUCCESS = 'ENEWSNOTE_SEARCH_SUCCESS';
const NEWSNOTE_SEARCH_FAILURE = 'NEWSNOTE_SEARCH_FAILURE';
const NEWSNOTE_CHANGESEARCH = 'NEWSNOTE_CHANGESEARCH';
const NEWSNOTE_CLEARSEARCH = 'NEWSNOTE_CLEARSEARCH';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  changeSearch: createAction(NEWSNOTE_CHANGESEARCH, 'fields'),
  clearSearch: createAction(NEWSNOTE_CLEARSEARCH, 'fields'),
  search: (params) => {
    const pageSize = params.pageSize || 10;
    const pageNo = params.pageNo || 1;

    const paramsTemp = {
      ...params,
      pageNo,
      pageSize,
    };
    return {
      types: [NEWSNOTE_SEARCH_REQUEST, NEWSNOTE_SEARCH_SUCCESS, NEWSNOTE_SEARCH_FAILURE],
      callAPI: () => fetch('/storeManage/sms/list', paramsTemp),
    };
  },
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NEWSNOTE_SEARCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [NEWSNOTE_SEARCH_SUCCESS]    : (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const { list } = data;

    newState.data = [];
    for (let i = 0; i < list.length; i += 1) {
      const time = list[i].time && DateUtil.formatDate(list[i].time, 'yyyy-MM-dd HH:mm');
      let newsType;
      switch (list[i].newsType) {
        case 'qujian':
          newsType = '取件';
          break;
        case 'jijian':
          newsType = '寄件';
          break;
        default:
          break;
      }
      newState.data.push({
        id: list[i].templateId + i,
        receiverPhone: list[i].receiverPhone,
        templateContent: list[i].templateContent,
        templateId: list[i].templateId,
        failReason: list[i].failReason,
        time,
        newsType,
        result: list[i].result,
      });
    }

    return {
      ...newState,
      loading:false,
      page:{
        ...newState.page,
        current:data.pageNo,
        count:data.totalSize,
        pageNo: data.pageNo,
        pageSize: 10,
      },
    };
  },
  [NEWSNOTE_SEARCH_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [NEWSNOTE_CHANGESEARCH]    : (state, action) => {
    let newState = { ...state };
    const { fields } = action;
    const { value } = fields.time;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    fields.time.value = array;
    newState = {
      ...newState,
      searchParams: {
        ...newState.searchParams,
        ...action.fields,
      },
    };
    return newState;
  },
  [NEWSNOTE_CLEARSEARCH]    :  (state) => ({
    ...state,
    searchParams: state.searchParamsStart,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  page: {
    current: 1,
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  searchParams: {
    pageNo: 1,
    pageSize: 10,
    time:{
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  searchParamsStart: {
    pageNo: 1,
    pageSize: 10,
    time:{
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  smsStatus:{
    0: '待发送',
    1: '等待回执',
    2: '发送失败',
    3: '发送成功',
    10: '异常状态',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
