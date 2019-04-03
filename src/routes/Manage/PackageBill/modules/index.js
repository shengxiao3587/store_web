import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------

const PACKAGEBILL_CLEARSEARCH = 'PACKAGEBILL_CLEARSEARCH';
const PACKAGEBILL_SEARCH_FAILURE = 'PACKAGEBILL_SEARCH_FAILURE';
const PACKAGEBILL_SEARCH_SUCCESS = 'PACKAGEBILL_SEARCH_SUCCESS';
const PACKAGEBILL_SEARCH_REQUEST = 'PACKAGEBILL_SEARCH_REQUEST';
const PACKAGEBILL_CHANGESEARCH = 'PACKAGEBILL_CHANGESEARCH';

const PACKAGEBILL_COOPERATORSEARCH_REQUEST = 'PACKAGEBILL_COOPERATORSEARCH_REQUEST';
const PACKAGEBILL_COOPERATORSEARCH_SUCCESS = 'PACKAGEBILL_COOPERATORSEARCH_SUCCESS';
const PACKAGEBILL_COOPERATORSEARCH_FAILURE = 'PACKAGEBILL_COOPERATORSEARCH_FAILURE';

const PACKAGEBILL_EXPORT_REQUEST = 'PACKAGEBILL_EXPORT_REQUEST';
const PACKAGEBILL_EXPORT_SUCCESS = 'PACKAGEBILL_EXPORT_SUCCESS';
const PACKAGEBILL_EXPORT_FAILURE = 'PACKAGEBILL_EXPORT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(PACKAGEBILL_CLEARSEARCH),
  changeSearch: createAction(PACKAGEBILL_CHANGESEARCH, 'record'),
  search: (params) => ({
    types: [
      PACKAGEBILL_SEARCH_REQUEST, PACKAGEBILL_SEARCH_SUCCESS, PACKAGEBILL_SEARCH_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/packageBill/detail', { ...params }),
    payload: { params },
  }),
  cooperatorSearch: (params) => ({
    types: [
      PACKAGEBILL_COOPERATORSEARCH_REQUEST,
      PACKAGEBILL_COOPERATORSEARCH_SUCCESS,
      PACKAGEBILL_COOPERATORSEARCH_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/cooperator/list', { cooperatorName: params.cooperatorName }),
    payload: { cooperatorName: params.cooperatorName },
  }),
  exportBill: (params) => ({
    types: [
      PACKAGEBILL_EXPORT_REQUEST, PACKAGEBILL_EXPORT_SUCCESS, PACKAGEBILL_EXPORT_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/tcbbill/export', params).then((json) => {
      if (!!json && typeof json === 'object' && json.constructor === Blob) {
        const downloadUrl = URL.createObjectURL(json);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '结算列表.xlsx';
        document.body.appendChild(a);
        a.click();
        return { resultCode:'0' };
      }
      return json;
    }),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PACKAGEBILL_CHANGESEARCH]    : (state, action) => {
    let newState = Object.assign({}, state);
    const { record } = action;
    const { value } = record.createDate;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    record.createDate.value = array;
    newState = {
      ...newState,
      dayParams: {
        ...newState.dayParams,
        ...action.record,
      },
    };
    return newState;
  },
  [PACKAGEBILL_CLEARSEARCH]    : (state) => ({
    ...state,
    dayParams: {
      createDate: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    dayPage: {
      pageSize: 10,
      count: 0,
      pageNo: 1,
    },
  }),
  [PACKAGEBILL_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PACKAGEBILL_SEARCH_SUCCESS]    : (state, action) => {
    const newState = {
      ...state,
      loading: false,
    };
    newState.dayData = [];
    action.data.list.map((item) => (
      newState.dayData.push({
        id:item.billNo,
        cooperatorPhone:item.cooperatorPhone,
        expressCompanyName:item.expressCompanyName,
        billMoney:item.billMoney,
        waybillNo:item.waybillNo,
        settleStatus:item.settleStatus,
        cooperatorName:item.cooperatorName,
        billNo:item.billNo,
        createDate:item.createDate,
        signDate:item.signDate,
      })
    ));
    newState.dayPage = {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      count: action.data.totalSize,
    };
    return newState;
  },
  [PACKAGEBILL_SEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PACKAGEBILL_COOPERATORSEARCH_REQUEST] : (state, action) => ({
    ...state,
    cooperatorData: {
      ...state.cooperatorData,
      loading: true,
      query: action.cooperatorName || '',
    },
  }),
  [PACKAGEBILL_COOPERATORSEARCH_SUCCESS]: (state, action) => {
    const {
      list,
    } = action.data;
    const newList = [];
    list.map((item) =>
      newList.push({
        id:item.cooperatorId,
        cooperatorId:item.cooperatorId,
        cooperatorName:item.cooperatorName,
      })
    );
    const data = [...newList];
    return {
      ...state,
      cooperatorData: {
        ...state.cooperatorData,
        loading: false,
        data,
      },
    };
  },
  [PACKAGEBILL_COOPERATORSEARCH_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      cooperatorData: {
        ...state.cooperatorData,
        loading: false,
      },
    };
  },
  [PACKAGEBILL_EXPORT_REQUEST] : (state) => ({
    ...state,
  }),
  [PACKAGEBILL_EXPORT_SUCCESS]: (state) => ({
    ...state,
  }),
  [PACKAGEBILL_EXPORT_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  dayData: [],
  dayPage: {
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  dayParams: {
    createDate: {
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  cooperatorData: {
    data: [],
    query: '',
    loading: false,
    pageNo: 1,
    pageSize: 999999,
    count: 0,
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
