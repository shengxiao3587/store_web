import { message } from 'antd';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const PROTOCOLSTEPS_GETSTATUS_SUCCESS = 'PROTOCOLSTEPS_GETSTATUS_SUCCESS';
const PROTOCOLSTEPS_GETSTATUS_REQUESTT = 'PROTOCOLSTEPS_GETSTATUS_REQUEST';
const PROTOCOLSTEPS_GETSTATUS_FAILURE = 'PROTOCOLSTEPS_GETSTATUS_FAILURE';
const PROTOCOLSTEPS_NEXTSTEP_SUCCESS = 'PROTOCOLSTEPS_NEXTSTEP_SUCCESS';
const PROTOCOLSTEPS_NEXTSTEP_REQUESTT = 'PROTOCOLSTEPS_NEXTSTEP_REQUESTT';
const PROTOCOLSTEPS_NEXTSTEP_FAILURE = 'PROTOCOLSTEPS_NEXTSTEP_FAILURE';

const PROTOCOLSTEPS_NEXTSTEPPAY_REQUESTT = 'PROTOCOLSTEPS_NEXTSTEPPAY_REQUESTT';
const PROTOCOLSTEPS_NEXTSTEPPAY_SUCCESS = 'PROTOCOLSTEPS_NEXTSTEPPAY_SUCCESS';
const PROTOCOLSTEPS_NEXTSTEPPAY_FAILURE = 'PROTOCOLSTEPS_NEXTSTEPPAY_FAILURE';

const PROTOCOLSTEPS_SHOWPROTOCOL = 'PROTOCOLSTEPS_SHOWPROTOCOL';
const PROTOCOLSTEPS_CLOSEPROTOCOL = 'PROTOCOLSTEPS_CLOSEPROTOCOL';
const PROTOCOLSTEPS_CHANGECHECKED = 'PROTOCOLSTEPS_CHANGECHECKED';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  showProtocol: createAction(PROTOCOLSTEPS_SHOWPROTOCOL),
  closeProtocol: createAction(PROTOCOLSTEPS_CLOSEPROTOCOL),
  changeChecked: createAction(PROTOCOLSTEPS_CHANGECHECKED),
  getStatus: () => ({
    types: [PROTOCOLSTEPS_GETSTATUS_REQUESTT, PROTOCOLSTEPS_GETSTATUS_SUCCESS, PROTOCOLSTEPS_GETSTATUS_FAILURE],
    callAPI: () => fetch('/storeManage/enterGuide/getStatus'),
  }),
  nextStep: (params) => ({
    types: [PROTOCOLSTEPS_NEXTSTEP_REQUESTT, PROTOCOLSTEPS_NEXTSTEP_SUCCESS, PROTOCOLSTEPS_NEXTSTEP_FAILURE],
    callAPI: () => fetch('/storeManage/enterGuide/update', params),
    payload: { params },
  }),
  nextStepPay: (params) => ({
    types: [PROTOCOLSTEPS_NEXTSTEPPAY_REQUESTT, PROTOCOLSTEPS_NEXTSTEPPAY_SUCCESS, PROTOCOLSTEPS_NEXTSTEPPAY_FAILURE],
    callAPI: () => fetch('/storeManage/deposit/pay', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PROTOCOLSTEPS_NEXTSTEPPAY_REQUESTT]: (state) => ({
    ...state,
    loading: true,
  }),
  [PROTOCOLSTEPS_NEXTSTEPPAY_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    htmlCode: action.data,
  }),
  [PROTOCOLSTEPS_NEXTSTEPPAY_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PROTOCOLSTEPS_SHOWPROTOCOL]: (state) => ({
    ...state,
    protocolVisible: true,
    checkboxStatus: true,
    checked: true,
  }),
  [PROTOCOLSTEPS_CHANGECHECKED]: (state) => ({
    ...state,
    checked: !state.checked,
  }),
  [PROTOCOLSTEPS_CLOSEPROTOCOL]: (state) => ({
    ...state,
    protocolVisible: false,
  }),
  [PROTOCOLSTEPS_NEXTSTEP_REQUESTT]: (state) => ({
    ...state,
  }),
  [PROTOCOLSTEPS_NEXTSTEP_SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      // money: action.data.money,
      // payee: action.data.payee,
    };
    if (action.params.myStep === 3) {
      newState.stepNum = 3;
    }
    return newState;
  },
  [PROTOCOLSTEPS_NEXTSTEP_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [PROTOCOLSTEPS_GETSTATUS_REQUESTT]: (state) => ({
    ...state,
  }),
  [PROTOCOLSTEPS_GETSTATUS_SUCCESS]: (state, action) => ({
    ...state,
    stepNum: action.data.step,
    money: action.data.money,
    payee: action.data.payee,
    payFlag: action.data.payFlag,
    effectTime: action.data.effectTime,
    wealPolicyContent: action.data.wealPolicyContent,
  }),
  [PROTOCOLSTEPS_GETSTATUS_FAILURE]: (state, action) => {
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
