import { message } from 'antd';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

const CryptoJS = require('../../../../../lib/crypto-js');

// ------------------------------------
// Constants
// ------------------------------------
const WALLETOUT_DETAIL_REQUEST = 'WALLETOUT_DETAIL_REQUEST';
const WALLETOUT_DETAIL_SUCCESS = 'WALLETOUT_DETAIL_SUCCESS';
const WALLETOUT_DETAIL_FAILURE = 'WALLETOUT_DETAIL_FAILURE';


const WALLETOUT_SAVE_REQUEST = 'WALLETOUT_SAVE_REQUEST';
const WALLETOUT_SAVE_SUCCESS = 'WALLETOUT_SAVE_SUCCESS';
const WALLETOUT_SAVE_FAILURE = 'WALLETOUT_SAVE_FAILURE';

const WALLETOUT_FORGETSAVE_FAILURE = 'WALLETOUT_FORGETSAVE_FAILURE';
const WALLETOUT_FORGETSAVE_SUCCESS = 'WALLETOUT_FORGETSAVE_SUCCESS';
const WALLETOUT_FORGETSAVE_REQUEST = 'WALLETOUT_FORGETSAVE_REQUEST';

const WALLETOUT_SENDNOTE_REQUEST = 'WALLETOUT_SENDNOTE_REQUEST';
const WALLETOUT_SENDNOTE_SUCCESS = 'WALLETOUT_SENDNOTE_SUCCESS';
const WALLETOUT_SENDNOTE_FAILURE = 'WALLETOUT_SENDNOTE_FAILURE';

const WALLETOUT_GETPHONE_FAILURE = 'WALLETOUT_GETPHONE_FAILURE';
const WALLETOUT_GETPHONE_SUCCESS = 'WALLETOUT_GETPHONE_SUCCESS';
const WALLETOUT_GETPHONE_REQUEST = 'WALLETOUT_GETPHONE_REQUEST';

const WALLETOUT_CHANGERECORD = 'WALLETOUT_CHANGERECORD';
const WALLETOUT_ONSHAOWMODAL = 'WALLETOUT_ONSHAOWMODAL';
const WALLETOUT_CANCEL = 'WALLETOUT_CANCEL';

// ------------------------------------
// 加密规则
// ------------------------------------
const key = CryptoJS.enc.Latin1.parse('dGJiZXhwcmVzcw==');
const iv = CryptoJS.enc.Latin1.parse('fxlyyqiuwwljqwss');

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  onCancel: createAction(WALLETOUT_CANCEL),
  onShowModal: createAction(WALLETOUT_ONSHAOWMODAL, 'params'),
  detail: (params) => ({
    types: [WALLETOUT_DETAIL_REQUEST, WALLETOUT_DETAIL_SUCCESS, WALLETOUT_DETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/withdraw/detail', params),
  }),
  save: (params) => ({
    types: [WALLETOUT_SAVE_REQUEST, WALLETOUT_SAVE_SUCCESS, WALLETOUT_SAVE_FAILURE],
    callAPI: () => {
      const newParams = {
        ...params,
      };
      const password = CryptoJS.AES.encrypt(
        params.password,
        key,
        {
          iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
        });
      newParams.password = password.toString();
      return fetch('/storeManage/withdraw/confirm', newParams);
    },
    payload: {
      params,
    },
  }),
  forgetSave: (params) => ({
    types: [WALLETOUT_FORGETSAVE_REQUEST, WALLETOUT_FORGETSAVE_SUCCESS, WALLETOUT_FORGETSAVE_FAILURE],
    callAPI: () => {
      const newParams = {
        ...params,
      };
      newParams.storePassword = typeof newParams.storePassword === 'string' ?
        newParams.storePassword : newParams.storePassword.value;
      newParams.pwdConfirm = typeof newParams.pwdConfirm === 'string' ?
        newParams.pwdConfirm : newParams.pwdConfirm.value;
      newParams.newPassword = typeof newParams.newPassword === 'string' ?
        newParams.newPassword : newParams.newPassword.value;
      const storePassword = CryptoJS.AES.encrypt(
        newParams.storePassword,
        key,
        {
          iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
        });
      const pwdConfirm = CryptoJS.AES.encrypt(
        newParams.pwdConfirm,
        key,
        {
          iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
        });
      const newPassword = CryptoJS.AES.encrypt(
        newParams.newPassword,
        key,
        {
          iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
        });
      newParams.storePassword = storePassword.toString();
      newParams.pwdConfirm = pwdConfirm.toString();
      newParams.newPassword = newPassword.toString();
      return fetch('/storeManage/withdraw/forgetPassword', newParams);
    },
    payload: {
      params,
    },
  }),
  changeRecord:createAction(WALLETOUT_CHANGERECORD, 'params'),
  sendNote:(params) => ({
    types: [WALLETOUT_SENDNOTE_REQUEST, WALLETOUT_SENDNOTE_SUCCESS, WALLETOUT_SENDNOTE_FAILURE],
    callAPI: () => fetch('/storeManage/withdraw/getValidCode', params),
  }),
  getPhone: (params) => ({
    types: [WALLETOUT_GETPHONE_REQUEST, WALLETOUT_GETPHONE_SUCCESS, WALLETOUT_GETPHONE_FAILURE],
    callAPI: () => fetch('/storeManage/financial/info', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WALLETOUT_GETPHONE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLETOUT_GETPHONE_SUCCESS]    : (state, action) => ({
    ...state,
    getStorePhone: action.data.phone,
    record: {
      ...state.record,
      phone: `您当前绑定的手机号为${action.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
    },
  }),
  [WALLETOUT_GETPHONE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLETOUT_SAVE_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [WALLETOUT_SAVE_SUCCESS]    : (state) => {
    message.success('预计1-5个工作日到账，请耐心等候');
    return {
      ...state,
      visibleBank:false,
      loading: false,
    };
  },
  [WALLETOUT_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [WALLETOUT_SENDNOTE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLETOUT_SENDNOTE_SUCCESS]    : (state) => ({
    ...state,
  }),
  [WALLETOUT_SENDNOTE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLETOUT_DETAIL_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [WALLETOUT_DETAIL_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      bindbankData: data,
    };
  },
  [WALLETOUT_DETAIL_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [WALLETOUT_FORGETSAVE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLETOUT_FORGETSAVE_SUCCESS]    : (state) => {
    message.success('设置成功');
    return {
      ...state,
      visibleData: {
        ...state.visibleData,
        visibleForget: false,
      },
    };
  },
  [WALLETOUT_FORGETSAVE_FAILURE]    : (state, action) => ({
    ...state,
    errorExplain: action.msg,
  }),
  [WALLETOUT_ONSHAOWMODAL]    : (state) => ({
    ...state,
    visibleData: {
      ...state.visibleData,
      visibleForget: true,
    },
    errorExplain: '',
  }),
  [WALLETOUT_CANCEL]    : (state) => ({
    ...state,
    visibleData: {
      ...state.visibleData,
      visibleForget: false,
    },
    errorExplain: '',
  }),
  [WALLETOUT_CHANGERECORD]    : (state, action) => ({
    ...state,
    record:{
      ...state.record,
      ...action.params,
    },
    errorExplain:'',
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  visibleData: {
    visibleForget: false,
  },
  record: {
    phone: {
      value: '',
    },
    authCode: {
      value: '',
    },
  },
  getStorePhone:'',
  bindbankData:{
    bankType: '储蓄卡',
    bankNum: '**** **** **** ****',
    bank: 'ABC',
    money: '0',
    phone: '***********',
  },
  // 农业、中国、建设、杭州、工商、招商
  bankPicTypeData: {
    ABC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/agricultural_bank%403x.png',
    BOC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/bankofChina%403x.png',
    CCB: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/construction_bank%403x.png',
    HCCB: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/hzbank%403x.png',
    ICBC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/industrial_commercial_bank%403x.png',
    CMB: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/merchants_bank%403x.png',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
