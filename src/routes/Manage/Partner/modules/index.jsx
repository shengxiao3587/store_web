import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const PARTNER_CHANGSEARCH = 'PARTNER_CHANGSEARCH';

const PARTNER_SEARCH_REQUEST = 'PARTNER_SEARCH_REQUEST';
const PARTNER_SEARCH_SUCCESS = 'PARTNER_SEARCH_SUCCESS';
const PARTNER_SEARCH_FAILURE = 'PARTNER_SEARCH_FAILURE';

const PARTNER_OPS_REQUEST = 'PARTNER_OPS_REQUEST';
const PARTNER_OPS_SUCCESS = 'PARTNER_OPS_SUCCESS';
const PARTNER_OPS_FAILURE = 'PARTNER_OPS_FAILURE';
const PARTNER_CLEARSEARCH = 'PARTNER_CLEARSEARCH';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(PARTNER_CLEARSEARCH),
  changeSearch: createAction(PARTNER_CHANGSEARCH, 'params'),
  search: (params) => ({
    types: [PARTNER_SEARCH_REQUEST, PARTNER_SEARCH_SUCCESS, PARTNER_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/protocol/list', params),
  }),
  ops: (params) => ({
    types: [PARTNER_OPS_REQUEST, PARTNER_OPS_SUCCESS, PARTNER_OPS_FAILURE],
    callAPI: () => fetch('/storeManage/protocol/ops', params),
  }),
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PARTNER_OPS_REQUEST]    : (state) => ({
    ...state,
    buttonloading: true,
  }),
  [PARTNER_OPS_SUCCESS]    : (state) => {
    message.success('已发送请求，等待合作对象同意');
    return {
      ...state,
      buttonloading: false,
    };
  },
  [PARTNER_OPS_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonloading: false,
    };
  },
  [PARTNER_CLEARSEARCH]    : (state) => ({
    ...state,
    searchParams: {
      createDate: {
        value:[
          moment().subtract(90, 'days'),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    page: {
      pageNo: '1',
      count: '0',
      pageSize: '10',
    },
  }),
  [PARTNER_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PARTNER_SEARCH_SUCCESS]    : (state, action) => {
    let newState = Object.assign({}, state);
    const { data } = action;
    const { list } = data;
    const newData = [];
    for (let i = 0; i < list.length; i += 1) {
      const uniqueKey = list[i].id;
      newData.push({
        ...list[i],
        uniqueKey,
        key: uniqueKey,
      });
    }
    newState = {
      ...newState,
      loading: false,
      data: newData,
      page: {
        pageNo: data.pageNo,
        count: data.totalSize,
        pageSize: data.pageSize,
      },
    };
    return newState;
  },
  [PARTNER_SEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      loading: false,
    };
    return newState;
  },
  [PARTNER_CHANGSEARCH]    : (state, action) => {
    let newState = Object.assign({}, state);
    const { params } = action;
    const { value } = params.createDate;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    params.createDate.value = array;
    newState = {
      ...newState,
      searchParams: {
        ...newState.searchParams,
        ...action.params,
      },
    };
    return newState;
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  page: {
    pageNo: '1',
    count: '0',
    pageSize: '10',
  },
  searchParams: {
    createDate: {
      value:[
        moment().subtract(90, 'days'),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  buttonloading: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
