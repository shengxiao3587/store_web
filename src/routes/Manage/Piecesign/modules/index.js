import { message } from 'antd';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const PIECESIGN_CHANGERECORD = 'PIECESIGN_CHANGERECORD';
const PIECESIGN_RESET = 'PIECESIGN_RESET';
const PIECESIGN_SEARCH_SUCCESS = 'PIECESIGN_SEARCH_SUCCESS';
const PIECESIGN_SEARCH_FAILURE = 'PIECESIGN_SEARCH_FAILURE';
const PIECESIGN_SEARCH_REQUEST = 'PIECESIGN_SEARCH_REQUEST';
const PIECESIGN_EMITEMPTY = 'PIECESIGN_EMITEMPTY';
// li
const PIECESIGN_CHANGEKEYCODE = 'PIECESIGN_CHANGEKEYCODE';
const PIECESIGN_CODESTATUSADD = 'PIECESIGN_CODESTATUSADD';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  codeStatusAdd: createAction(PIECESIGN_CODESTATUSADD),
  changeKeyCode: createAction(PIECESIGN_CHANGEKEYCODE, 'params'),
  changeRecord: createAction(PIECESIGN_CHANGERECORD, 'params'),
  reset: createAction(PIECESIGN_RESET),
  save: (params) => ({
    types: [PIECESIGN_SEARCH_REQUEST, PIECESIGN_SEARCH_SUCCESS, PIECESIGN_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/express/sign', params),
  }),
  emitEmpty: createAction(PIECESIGN_EMITEMPTY, 'value'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PIECESIGN_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PIECESIGN_SEARCH_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      data: {},
      loading: false,
    };
  },
  [PIECESIGN_SEARCH_FAILURE]    : (state, action) => {
    if (action.msgCode === '31' || action.msgCode === '37') {
      message.error('该运单未入库，请将快递入库');
    } else if (action.msgCode === '34') {
      message.error(`${action.msg},请勿重复操作`);
    } else {
      message.error(action.msg);
    }
    return {
      ...state,
      loading: false,
    };
  },
  [PIECESIGN_CHANGERECORD]    : (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.params,
    },
  }),
  [PIECESIGN_RESET]    : (state) => ({
    ...state,
    data: {},
    loading: false,
  }),
  [PIECESIGN_EMITEMPTY]    : (state, action) => ({
    ...state,
    data: {
      ...state.data,
      [action.value]: '',
    },
  }),
  [PIECESIGN_CODESTATUSADD]    : (state) => ({
    ...state,
    codeStatus: 2,
  }),
  [PIECESIGN_CHANGEKEYCODE]    : (state, action) => ({
    ...state,
    codeStatus: 1,
    data: {
      ...state.data,
      [action.params]: '',
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: {},
  codeStatus: 1,
  loading: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
