import { message } from 'antd';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const PROTOCOLREWEW_GETSTATUS_SUCCESS = 'PROTOCOLREWEW_GETSTATUS_SUCCESS';
const PROTOCOLREWEW_GETSTATUS_REQUESTT = 'PROTOCOLREWEW_GETSTATUS_REQUEST';
const PROTOCOLREWEW_GETSTATUS_FAILURE = 'PROTOCOLREWEW_GETSTATUS_FAILURE';
const PROTOCOLREWEW_NEXTSTEP = 'PROTOCOLREWEW_NEXTSTEP';

const PROTOCOLREWEW_NEXTSTEPPAY_REQUESTT = 'PROTOCOLREWEW_NEXTSTEPPAY_REQUESTT';
const PROTOCOLREWEW_NEXTSTEPPAY_SUCCESS = 'PROTOCOLREWEW_NEXTSTEPPAY_SUCCESS';
const PROTOCOLREWEW_NEXTSTEPPAY_FAILURE = 'PROTOCOLREWEW_NEXTSTEPPAY_FAILURE';

const PROTOCOLREWEW_DISPAY_REQUESTT = 'PROTOCOLREWEW_DISPAY_REQUESTT';
const PROTOCOLREWEW_DISPAY_SUCCESS = 'PROTOCOLREWEW_DISPAY_SUCCESS';
const PROTOCOLREWEW_DISPAY_FAILURE = 'PROTOCOLREWEW_DISPAY_FAILURE';

const PROTOCOLREWEW_SHOWPROTOCOL = 'PROTOCOLREWEW_SHOWPROTOCOL';
const PROTOCOLREWEW_CLOSEPROTOCOL = 'PROTOCOLREWEW_CLOSEPROTOCOL';
const PROTOCOLREWEW_CHANGECHECKED = 'PROTOCOLREWEW_CHANGECHECKED';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  showProtocol: createAction(PROTOCOLREWEW_SHOWPROTOCOL),
  closeProtocol: createAction(PROTOCOLREWEW_CLOSEPROTOCOL),
  changeChecked: createAction(PROTOCOLREWEW_CHANGECHECKED),
  disPay: () => ({
    types: [PROTOCOLREWEW_DISPAY_REQUESTT, PROTOCOLREWEW_DISPAY_SUCCESS, PROTOCOLREWEW_DISPAY_FAILURE],
    callAPI: () => fetch('/storeManage/paySystemFee/free'),
  }),
  getStatus: () => ({
    types: [PROTOCOLREWEW_GETSTATUS_REQUESTT, PROTOCOLREWEW_GETSTATUS_SUCCESS, PROTOCOLREWEW_GETSTATUS_FAILURE],
    callAPI: () => fetch('/storeManage/paySystemFee/getData'),
  }),
  nextStep: createAction(PROTOCOLREWEW_NEXTSTEP),
  nextStepPay: (params) => ({
    types: [PROTOCOLREWEW_NEXTSTEPPAY_REQUESTT, PROTOCOLREWEW_NEXTSTEPPAY_SUCCESS, PROTOCOLREWEW_NEXTSTEPPAY_FAILURE],
    callAPI: () => fetch('/storeManage/deposit/pay', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PROTOCOLREWEW_NEXTSTEPPAY_REQUESTT]: (state) => ({
    ...state,
    loading: true,
  }),
  [PROTOCOLREWEW_NEXTSTEPPAY_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    htmlCode: action.data,
  }),
  [PROTOCOLREWEW_NEXTSTEPPAY_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PROTOCOLREWEW_SHOWPROTOCOL]: (state) => ({
    ...state,
    protocolVisible: true,
    checkboxStatus: true,
    checked: true,
  }),
  [PROTOCOLREWEW_CHANGECHECKED]: (state) => ({
    ...state,
    checked: !state.checked,
  }),
  [PROTOCOLREWEW_CLOSEPROTOCOL]: (state) => ({
    ...state,
    protocolVisible: false,
  }),
  [PROTOCOLREWEW_NEXTSTEP]: (state) => ({
    ...state,
    stepNum: 2,
  }),
  [PROTOCOLREWEW_GETSTATUS_REQUESTT]: (state) => ({
    ...state,
  }),
  [PROTOCOLREWEW_GETSTATUS_SUCCESS]: (state, action) => ({
    ...state,
    stepNum: 1,
    money: action.data.systemMoney,
    payee: action.data.payee,
    payFlag: action.data.payFlag,
    effectTime: action.data.effectTime,
    wealPolicyContent: action.data.wealPolicyContent,
  }),
  [PROTOCOLREWEW_GETSTATUS_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [PROTOCOLREWEW_DISPAY_REQUESTT]: (state) => ({
    ...state,
  }),
  [PROTOCOLREWEW_DISPAY_SUCCESS]: (state) => ({
    ...state,
    stepNum: 3,
  }),
  [PROTOCOLREWEW_DISPAY_FAILURE]: (state, action) => {
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
  protocolVisible: false,
  stepNum: 1,
  wealPolicyContent: '',
  checkboxStatus: false,
  checked: false,
  loading: false,
  htmlCode: '',
  payFlag: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
