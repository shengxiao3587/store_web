import { message } from 'antd';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const NAMELIST_CHANGEVISABLE = 'NAMELIST_CHANGEVISABLE';
const NAMELIST_CLOSEVISABLE = 'NAMELIST_CLOSEVISABLE';
const NAMELIST_CHANGERECORD = 'NAMELIST_CHANGERECORD';
const NAMELIST_CHANGSEARCH = 'NAMELIST_CHANGSEARCH';

const NAMELIST_SEARCH_REQUEST = 'NAMELIST_SEARCH_REQUEST';
const NAMELIST_SEARCH_SUCCESS = 'NAMELIST_SEARCH_SUCCESS';
const NAMELIST_SEARCH_FAILURE = 'NAMELIST_SEARCH_FAILURE';

const NAMELIST_SAVE_REQUEST = 'NAMELIST_SAVE_REQUEST';
const NAMELIST_SAVE_SUCCESS = 'NAMELIST_SAVE_SUCCESS';
const NAMELIST_SAVE_FAILURE = 'NAMELIST_SAVE_FAILURE';

const NAMELIST_DEL_REQUEST = 'NAMELIST_DEL_REQUEST';
const NAMELIST_DEL_SUCCESS = 'NAMELIST_DEL_SUCCESS';
const NAMELIST_DEL_FAILURE = 'NAMELIST_DEL_FAILURE';
const NAMELIST_CLEARSEARCH = 'NAMELIST_CLEARSEARCH';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(NAMELIST_CLEARSEARCH),
  changeSearch: createAction(NAMELIST_CHANGSEARCH, 'params'),
  changeVisible: createAction(NAMELIST_CHANGEVISABLE, 'params'),
  changeRecord: createAction(NAMELIST_CHANGERECORD, 'params'),
  closeVisable: createAction(NAMELIST_CLOSEVISABLE),
  search: (params) => ({
    types: [NAMELIST_SEARCH_REQUEST, NAMELIST_SEARCH_SUCCESS, NAMELIST_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/blackUser/list', params),
  }),
  save: (params) => ({
    types: [NAMELIST_SAVE_REQUEST, NAMELIST_SAVE_SUCCESS, NAMELIST_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/blackUser/add', params),
  }),
  del: (params) => ({
    types: [NAMELIST_DEL_REQUEST, NAMELIST_DEL_SUCCESS, NAMELIST_DEL_FAILURE],
    callAPI: () => fetch('/storeManage/blackUser/delete', params),
  }),
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NAMELIST_CLEARSEARCH]    : (state) => ({
    ...state,
    searchParams: {},
    page: {},
  }),
  [NAMELIST_CHANGERECORD]    : (state, action) => ({
    ...state,
    modalData: {
      ...state.modalData,
      ...action.params,
    },
  }),
  [NAMELIST_DEL_REQUEST]    : (state) => ({
    ...state,
  }),
  [NAMELIST_DEL_SUCCESS]    : (state) => {
    message.success('操作成功');
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
    };
    return newState;
  },
  [NAMELIST_DEL_FAILURE]    : (state, action) => {
    message.error(action.msg);
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
    };
    return newState;
  },
  [NAMELIST_SAVE_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [NAMELIST_SAVE_SUCCESS]    : (state) => {
    message.success('操作成功');
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      buttonLoading: false,
      modalStatus: false,
      visible: false,
    };
    return newState;
  },
  [NAMELIST_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      buttonLoading: false,
    };
    return newState;
  },
  [NAMELIST_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [NAMELIST_SEARCH_SUCCESS]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      loading: false,
      data: action.data.list,
      page: {
        pageNo: action.data.pageNo,
        count: action.data.totalSize,
        pageSize: action.data.pageSize,
      },
    };
    return newState;
  },
  [NAMELIST_SEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      loading: false,
    };
    return newState;
  },
  [NAMELIST_CHANGSEARCH]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      searchParams: {
        ...newState.searchParams,
        ...action.params,
      },
    };
    return newState;
  },
  [NAMELIST_CLOSEVISABLE]    : (state) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      visible: false,
    };
    return newState;
  },
  [NAMELIST_CHANGEVISABLE]    : (state, action) => {
    let newState = Object.assign({}, state);
    newState = {
      ...newState,
      visible: true,
      modalData: {
        ...action.params,
      },
      modalStatus: action.params.modalStatus,
      titleName: action.params.titleName,
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
  visible: false,
  modalData: {},
  modalStatus: false,
  buttonLoading: false,
  searchParams: {},
  titleName: '标记用户',
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
