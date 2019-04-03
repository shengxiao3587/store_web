import { message } from 'antd';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const EMPLOYEELIST_CHANGESEARCH = 'EMPLOYEELIST_CHANGESEARCH';
const EMPLOYEELIST_CHANGEVISIBLE = 'EMPLOYEELIST_CHANGEVISIBLE';
const EMPLOYEELIST_SAVE_REQUEST = 'EMPLOYEELIST_SAVE_REQUEST';
const EMPLOYEELIST_SAVE_SUCCESS = 'EMPLOYEELIST_SAVE_SUCCESS';
const EMPLOYEELIST_SAVE_FAILURE = 'EMPLOYEELIST_SAVE_FAILURE';
const EMPLOYEELIST_CHANGEVISIBLE_CLOSE = 'EMPLOYEELIST_CHANGEVISIBLE_CLOSE';
const EMPLOYEELIST_SEARCH_REQUEST = 'EMPLOYEELIST_SEARCH_REQUEST';
const EMPLOYEELIST_SEARCH_SUCCESS = 'EMPLOYEELIST_SEARCH_SUCCESS';
const EMPLOYEELIST_SEARCH_FAILURE = 'EMPLOYEELIST_SEARCH_FAILURE';
const EMPLOYEELIST_LOGOUT_REQUEST = 'EMPLOYEELIST_LOGOUT_REQUEST';
const EMPLOYEELIST_LOGOUT_SUCCESS = 'EMPLOYEELIST_LOGOUT_SUCCESS';
const EMPLOYEELIST_LOGOUT_FAILURE = 'EMPLOYEELIST_LOGOUT_FAILURE';
const EMPLOYEELIST_CHANGERECORD = 'EMPLOYEELIST_CHANGERECORD';
const EMPLOYEELIST_CLEARSEARCH = 'EMPLOYEELIST_CLEARSEARCH';
const EMPLOYEELIST_CHANGEACTIVEKEY = 'EMPLOYEELIST_CHANGEACTIVEKEY';

const EMPLOYEELIST_RIDERSEARCH_REQUEST = 'EMPLOYEELIST_RIDERSEARCH_REQUEST';
const EMPLOYEELIST_RIDERSEARCH_SUCCESS = 'EMPLOYEELIST_RIDERSEARCH_SUCCESS';
const EMPLOYEELIST_RIDERSEARCH_FAILURE = 'EMPLOYEELIST_RIDERSEARCH_FAILURE';
const EMPLOYEELIST_AUDIT_REQUEST = 'EMPLOYEELIST_AUDIT_REQUEST';
const EMPLOYEELIST_AUDIT_SUCCESS = 'EMPLOYEELIST_AUDIT_SUCCESS';
const EMPLOYEELIST_AUDIT_FAILURE = 'EMPLOYEELIST_AUDIT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(EMPLOYEELIST_CLEARSEARCH),
  changeActiveKey: createAction(EMPLOYEELIST_CHANGEACTIVEKEY, 'key'),
  changeRecord: createAction(EMPLOYEELIST_CHANGERECORD, 'record'),
  changeSearch: createAction(EMPLOYEELIST_CHANGESEARCH, 'record'),
  changeVisible: createAction(EMPLOYEELIST_CHANGEVISIBLE, 'record'),
  handleCancel: createAction(EMPLOYEELIST_CHANGEVISIBLE_CLOSE),
  audit: (params) => ({
    types: [EMPLOYEELIST_AUDIT_REQUEST, EMPLOYEELIST_AUDIT_SUCCESS, EMPLOYEELIST_AUDIT_FAILURE],
    callAPI: () => fetch('/storeManage/rider/audit', params),
  }),
  logout: (params) => ({
    types: [EMPLOYEELIST_LOGOUT_REQUEST, EMPLOYEELIST_LOGOUT_SUCCESS, EMPLOYEELIST_LOGOUT_FAILURE],
    callAPI: () => fetch('/storeManage/employee/edit', params),
  }),
  save: (params) => ({
    types: [EMPLOYEELIST_SAVE_REQUEST, EMPLOYEELIST_SAVE_SUCCESS, EMPLOYEELIST_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/employee/save', params),
  }),
  riderSearch: (params) => ({
    types: [EMPLOYEELIST_RIDERSEARCH_REQUEST, EMPLOYEELIST_RIDERSEARCH_SUCCESS, EMPLOYEELIST_RIDERSEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/riderInfo/query', params),
  }),
  search: (params) => {
    const pageSize = params.pageSize || '10';
    const pageNo = params.pageNo || '1';
    const paramsTemp = {
      ...params,
      pageSize,
      pageNo,
    };

    return ({
      types: [EMPLOYEELIST_SEARCH_REQUEST, EMPLOYEELIST_SEARCH_SUCCESS, EMPLOYEELIST_SEARCH_FAILURE],
      callAPI: () => fetch('/storeManage/employee/list', paramsTemp),
      payload: { params },
    });
  },
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [EMPLOYEELIST_AUDIT_REQUEST]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      riderButtonLoading: true,
    };

    return newState;
  },
  [EMPLOYEELIST_AUDIT_SUCCESS]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      riderButtonLoading: false,
    };
    return newState;
  },
  [EMPLOYEELIST_AUDIT_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      riderButtonLoading: false,
    };
  },
  [EMPLOYEELIST_RIDERSEARCH_REQUEST]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      riderLoading: true,
    };

    return newState;
  },
  [EMPLOYEELIST_RIDERSEARCH_SUCCESS]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      riderData: action.data.list,
      riderLoading: false,
    };
    return newState;
  },
  [EMPLOYEELIST_RIDERSEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      riderLoading: false,
    };
  },
  [EMPLOYEELIST_CHANGERECORD]    : (state, action) => ({
    ...state,
    modalData: {
      ...state.modalData,
      ...action.record,
    },
  }),
  [EMPLOYEELIST_CHANGESEARCH]    : (state, action) => {
    let newState = Object.assign({}, state);
    if (action.record.type === 0) {
      newState = {
        ...newState,
        searchParams: {
          ...newState.searchParams,
          ...action.record,
        },
      };
    }
    if (action.record.type === 1) {
      newState = {
        ...newState,
        riderSearchParams: {
          ...newState.riderSearchParams,
          ...action.record,
        },
      };
    }
    return newState;
  },
  [EMPLOYEELIST_CHANGEVISIBLE_CLOSE]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      modalVisible: false,
      modalData: {},
    };
    return newState;
  },
  [EMPLOYEELIST_CHANGEVISIBLE]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      modalVisible: true,
      modalData: {
        ...action.record,
        employeeType: action.record.employeeType,
      },
    };
    return newState;
  },
  [EMPLOYEELIST_SEARCH_REQUEST]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      loading: true,
    };
    return newState;
  },
  [EMPLOYEELIST_SEARCH_SUCCESS]    : (state, action) => {
    let newState = Object.assign({}, state);
    const { data } = action;
    const { list } = data;

    newState = {
      ...newState,
      loading: false,
      data: list,
      page: {
        pageNo: data.pageNo,
        count: data.totalSize,
        pageSize: data.pageSize,
      },
    };

    return newState;
  },
  [EMPLOYEELIST_SEARCH_FAILURE]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      loading: false,
    };
    message.error(action.msg);
    return newState;
  },
  [EMPLOYEELIST_SAVE_REQUEST]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      modalVisible: true,
    };

    return newState;
  },
  [EMPLOYEELIST_SAVE_SUCCESS]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      modalVisible: false,
    };
    message.success('保存成功');
    return newState;
  },
  [EMPLOYEELIST_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);

    return {
      ...state,
      modalVisible: true,
    };
  },
  [EMPLOYEELIST_LOGOUT_REQUEST]    : (state) => ({
    ...state,
  }),
  [EMPLOYEELIST_LOGOUT_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
    };
  },
  [EMPLOYEELIST_LOGOUT_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EMPLOYEELIST_CHANGEACTIVEKEY]    : (state, action) => ({
    ...state,
    activeKey: action.key,
  }),
  [EMPLOYEELIST_CLEARSEARCH]    : (state) => ({
    ...state,
    searchParams: {},
    riderSearchParams: {},
    page: {
      pageNo: 1,
      count: 0,
      pageSize: 10,
    },
    riderPage: {
      pageNo: 1,
      count: 0,
      pageSize: 10,
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  activeKey: '0',
  data: [],
  modalVisible: false,
  modalData: {},
  page: {
    pageNo: 1,
    count: 0,
    pageSize: 10,
  },
  riderPage: {
    pageNo: 1,
    count: 0,
    pageSize: 10,
  },
  searchParams: {},
  riderData: [],
  riderLoading: false,
  riderButtonLoading: false,
  riderSearchParams: {},
  // 要根据riderDelFlag状态判断success的值，使用list[][]方式
  processStatus: [{
    INIT: '待审核',
    STORE: '店长审核通过',
    CITY_BD: '城市经理审核通过',
    OP: '运营审核通过',
    SUCCESS: '认证成功',
    FAIL: '审核不通过',
  }, {
    INIT: '待审核',
    STORE: '店长审核通过',
    CITY_BD: '城市经理审核通过',
    OP: '运营审核通过',
    SUCCESS: '冻结',
    FAIL: '审核不通过',
  }],
  employeeTypeList: {
    11: '直营快递员',
    12: '兼职快递员',
    13: '社区骑手',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
