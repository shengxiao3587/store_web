import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------

const DISTRIBUTIONTASK_CHANGETABS = 'DISTRIBUTIONTASK_CHANGETABS';
const DISTRIBUTIONTASK_CHANGESEARCH = 'DISTRIBUTIONTASK_CHANGESEARCH';
const DISTRIBUTIONTASK_WAITSEARCH_FAILURE = 'DISTRIBUTIONTASK_WAITSEARCH_FAILURE';
const DISTRIBUTIONTASK_WAITSEARCH_SUCCESS = 'DISTRIBUTIONTASK_WAITSEARCH_SUCCESS';
const DISTRIBUTIONTASK_WAITSEARCH_REQUEST = 'DISTRIBUTIONTASK_WAITSEARCH_REQUEST';
const DISTRIBUTIONTASK_FINISHSEARCH_REQUEST = 'DISTRIBUTIONTASK_FINISHSEARCH_REQUEST';
const DISTRIBUTIONTASK_FINISHSEARCH_SUCCESS = 'DISTRIBUTIONTASK_FINISHSEARCH_SUCCESS';
const DISTRIBUTIONTASK_FINISHSEARCH_FAILURE = 'DISTRIBUTIONTASK_FINISHSEARCH_FAILURE';
const DISTRIBUTIONTASK_CLOSE_REQUEST = 'DISTRIBUTIONTASK_CLOSE_REQUEST';
const DISTRIBUTIONTASK_CLOSE_SUCCESS = 'DISTRIBUTIONTASK_CLOSE_SUCCESS';
const DISTRIBUTIONTASK_CLOSE_FAILURE = 'DISTRIBUTIONTASK_CLOSE_FAILURE';
const DISTRIBUTIONTASK_CLEARSEARCH = 'DISTRIBUTIONTASK_CLEARSEARCH';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(DISTRIBUTIONTASK_CLEARSEARCH),
  tabsChange: createAction(DISTRIBUTIONTASK_CHANGETABS, 'key'),
  changeSearch: createAction(DISTRIBUTIONTASK_CHANGESEARCH, 'record'),
  close: (params) => ({
    types: [DISTRIBUTIONTASK_CLOSE_REQUEST, DISTRIBUTIONTASK_CLOSE_SUCCESS, DISTRIBUTIONTASK_CLOSE_FAILURE],
    callAPI: () => fetch('/storeManage/appointTask/close', params),
  }),
  waitTasksearch: (params) => ({
    types: [
      DISTRIBUTIONTASK_WAITSEARCH_REQUEST, DISTRIBUTIONTASK_WAITSEARCH_SUCCESS, DISTRIBUTIONTASK_WAITSEARCH_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/appointTask/query', { ...params, typeFlag: '0' }),
  }),
  finishTasksearch: (params) => ({
    types: [
      DISTRIBUTIONTASK_FINISHSEARCH_REQUEST,
      DISTRIBUTIONTASK_FINISHSEARCH_SUCCESS,
      DISTRIBUTIONTASK_FINISHSEARCH_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/appointTask/query', { ...params, typeFlag: '1' }),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTIONTASK_CLEARSEARCH]    : (state) => ({
    ...state,
    finishTaskParams: {
      orderTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    waitTaskParams: {
      orderTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    waitPage: {
      pageSize: 10,
      totalSize: 0,
      pageNo: 1,
    },
    finishPage: {
      pageSize: 10,
      count: 0,
      pageNo: 1,
    },
  }),
  [DISTRIBUTIONTASK_CHANGESEARCH]    : (state, action) => {
    let newState = Object.assign({}, state);
    const { record } = action;
    const { value } = record.orderTime;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    record.orderTime.value = array;
    if (action.record.type === 0) {
      newState = {
        ...newState,
        waitTaskParams: {
          ...newState.waitTaskParams,
          ...action.record,
        },
      };
    }
    if (action.record.type === 1) {
      newState = {
        ...newState,
        finishTaskParams: {
          ...newState.finishTaskParams,
          ...action.record,
        },
      };
    }
    return newState;
  },
  [DISTRIBUTIONTASK_CHANGETABS]    : (state, action) => ({
    ...state,
    activeKey: action.key,
  }),
  [DISTRIBUTIONTASK_CLOSE_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [DISTRIBUTIONTASK_CLOSE_SUCCESS]    : (state) => ({
    ...state,
    buttonLoading: false,
  }),
  [DISTRIBUTIONTASK_CLOSE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoading: false,
    };
  },
  [DISTRIBUTIONTASK_WAITSEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTIONTASK_WAITSEARCH_SUCCESS]    : (state, action) => ({
    ...state,
    waitPage: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      count: action.data.totalSize,
    },
    loading: false,
    waitData: action.data.list,
  }),
  [DISTRIBUTIONTASK_WAITSEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [DISTRIBUTIONTASK_FINISHSEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTIONTASK_FINISHSEARCH_SUCCESS]    : (state, action) => ({
    ...state,
    finishPage: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      count: action.data.totalSize,
    },
    loading: false,
    finishData: action.data.list,
  }),
  [DISTRIBUTIONTASK_FINISHSEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  buttonLoading: false,
  waitData: [],
  finishData: [],
  activeKey: '0',
  waitPage: {
    pageSize: 10,
    totalSize: 0,
    pageNo: 1,
  },
  finishPage: {
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  distributionStatus: {
    RECEIVE: '待接单',
    PICKUP: '待取货',
    DISTRIBUTION: '配送中',
    FINISH: '已完成',
    CANCEL: '已关闭',
  },
  waitTaskParams: {
    orderTime: {
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  finishTaskParams: {
    orderTime: {
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
