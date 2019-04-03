import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

const CryptoJS = require('../../../../../lib/crypto-js');

// ------------------------------------
// Constants
// ------------------------------------
const WALLET_SEARCH_FAILURE = 'WALLET_SEARCH_FAILURE';
const WALLET_SEARCH_SUCCESS = 'WALLET_SEARCH_SUCCESS';
const WALLET_SEARCH_REQUEST = 'WALLET_SEARCH_REQUEST';

const WALLET_BINDBANKSAVE_FAILURE = 'WALLET_BINDBANKSAVE_FAILURE';
const WALLET_BINDBANKSAVE_SUCCESS = 'WALLET_BINDBANKSAVE_SUCCESS';
const WALLET_BINDBANKSAVE_REQUEST = 'WALLET_BINDBANKSAVE_REQUEST';

const WALLET_SETEDITSAVE_FAILURE = 'WALLET_SETEDITSAVE_FAILURE';
const WALLET_SETEDITSAVE_SUCCESS = 'WALLET_SETEDITSAVE_SUCCESS';
const WALLET_SETEDITSAVE_REQUEST = 'WALLET_SETEDITSAVE_REQUEST';

const WALLET_FORGETSAVE_FAILURE = 'WALLET_FORGETSAVE_FAILURE';
const WALLET_FORGETSAVE_SUCCESS = 'WALLET_FORGETSAVE_SUCCESS';
const WALLET_FORGETSAVE_REQUEST = 'WALLET_FORGETSAVE_REQUEST';

const WALLET_SENDNOTE_REQUEST = 'WALLET_SENDNOTE_REQUEST';
const WALLET_SENDNOTE_SUCCESS = 'WALLET_SENDNOTE_SUCCESS';
const WALLET_SENDNOTE_FAILURE = 'WALLET_SENDNOTE_FAILURE';

const WALLET_GETPHONE_FAILURE = 'WALLET_GETPHONE_FAILURE';
const WALLET_GETPHONE_SUCCESS = 'WALLET_GETPHONE_SUCCESS';
const WALLET_GETPHONE_REQUEST = 'WALLET_GETPHONE_REQUEST';

const WALLET_PATBILLLIST_REQUEST = 'WALLET_PATBILLLIST_REQUEST';
const WALLET_PATBILLLIST_SUCCESS = 'WALLET_PATBILLLIST_SUCCESS';
const WALLET_PATBILLLIST_FAILURE = 'WALLET_PATBILLLIST_FAILURE';

const WALLET_UNBINDBANK_REQUEST = 'WALLET_UNBINDBANK_REQUEST';
const WALLET_UNBINDBANK_SUCCESS = 'WALLET_UNBINDBANK_SUCCESS';
const WALLET_UNBINDBANK_FAILURE = 'WALLET_UNBINDBANK_FAILURE';

const WALLET_BANKDETAIL_REQUEST = 'WALLET_BANKDETAIL_REQUEST';
const WALLET_BANKDETAIL_SUCCESS = 'WALLET_BANKDETAIL_SUCCESS';
const WALLET_BANKDETAIL_FAILURE = 'WALLET_BANKDETAIL_FAILURE';

const WALLET_CANCEL = 'WALLET_CANCEL';
const WALLET_ONSHAOWMODAL = 'WALLET_ONSHAOWMODAL';
const WALLET_CHANGERECORD = 'WALLET_CHANGERECORD';
const WALLET_CHANGESEARCH = 'WALLET_CHANGESEARCH';

const WALLET_TRADEREMARK_REQUEST = 'WALLET_TRADEREMARK_REQUEST';
const WALLET_TRADEREMARK_SUCCESS = 'WALLET_TRADEREMARK_SUCCESS';
const WALLET_TRADEREMARK_FAILURE = 'WALLET_TRADEREMARK_FAILURE';
const WALLET_CLEARSEARCH = 'WALLET_CLEARSEARCH';
// ------------------------------------
// 加密规则
// ------------------------------------
const key = CryptoJS.enc.Latin1.parse('dGJiZXhwcmVzcw==');
const iv = CryptoJS.enc.Latin1.parse('fxlyyqiuwwljqwss');
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(WALLET_CLEARSEARCH),
  changeSearch: createAction(WALLET_CHANGESEARCH, 'params'),
  onCancel: createAction(WALLET_CANCEL),
  onShowModal: createAction(WALLET_ONSHAOWMODAL, 'params'),
  tradeRemark: (params) => ({
    types: [WALLET_TRADEREMARK_REQUEST, WALLET_TRADEREMARK_SUCCESS, WALLET_TRADEREMARK_FAILURE],
    callAPI: () => fetch('/storeManage/myPurse/tradeRemark', params),
    payload: {
      params,
    },
  }),
  search: (params) => ({
    types: [WALLET_SEARCH_REQUEST, WALLET_SEARCH_SUCCESS, WALLET_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/myPurse/info', params),
  }),
  paybillList: (params) => ({
    types: [WALLET_PATBILLLIST_REQUEST, WALLET_PATBILLLIST_SUCCESS, WALLET_PATBILLLIST_FAILURE],
    callAPI: () => fetch('/storeManage/myPurse/paybillList', params),
  }),
  bindBankSave: (params) => ({
    types: [WALLET_BINDBANKSAVE_REQUEST, WALLET_BINDBANKSAVE_SUCCESS, WALLET_BINDBANKSAVE_FAILURE],
    callAPI: () => fetch('/storeManage/bankCard/bind', params),
    payload: {
      params,
    },
  }),
  bankdetail: (params) => ({
    types: [WALLET_BANKDETAIL_REQUEST, WALLET_BANKDETAIL_SUCCESS, WALLET_BANKDETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/withdraw/detail', params),
  }),
  setEditSave: (params) => ({
    types: [WALLET_SETEDITSAVE_REQUEST, WALLET_SETEDITSAVE_SUCCESS, WALLET_SETEDITSAVE_FAILURE],
    callAPI: (getState) => {
      const newParams = {
        ...params,
      };

      newParams.newPassword = typeof newParams.newPassword === 'string' ?
        newParams.newPassword : newParams.newPassword.value;
      newParams.pwdConfirm = typeof newParams.pwdConfirm === 'string' ?
        newParams.pwdConfirm : newParams.pwdConfirm.value;
      const newPassword = CryptoJS.AES.encrypt(
        newParams.newPassword,
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
      newParams.newPassword = newPassword.toString();
      newParams.pwdConfirm = pwdConfirm.toString();
      let url;
      if (getState.Wallet.walletData.hasPassword) {
        newParams.oldPassword = typeof newParams.oldPassword === 'string' ?
          newParams.oldPassword : newParams.oldPassword.value;
        const oldPassword = CryptoJS.AES.encrypt(
          newParams.oldPassword,
          key,
          {
            iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
          });
        newParams.oldPassword = oldPassword.toString();
        url = '/storeManage/withdraw/changePassword';
      } else {
        url = '/storeManage/withdraw/password';
      }
      return fetch(url, newParams);
    },
    payload: {
      params,
    },
  }),
  forgetSave: (params) => ({
    types: [WALLET_FORGETSAVE_REQUEST, WALLET_FORGETSAVE_SUCCESS, WALLET_FORGETSAVE_FAILURE],
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
  changeRecord:createAction(WALLET_CHANGERECORD, 'params'),
  getPhone: (params) => ({
    types: [WALLET_GETPHONE_REQUEST, WALLET_GETPHONE_SUCCESS, WALLET_GETPHONE_FAILURE],
    callAPI: () => fetch('/storeManage/financial/info', params),
  }),
  sendNote:(params) => ({
    types: [WALLET_SENDNOTE_REQUEST, WALLET_SENDNOTE_SUCCESS, WALLET_SENDNOTE_FAILURE],
    callAPI: () => fetch('/storeManage/withdraw/getValidCode', params),
  }),
  unBindBank:(params) => ({
    types: [WALLET_UNBINDBANK_REQUEST, WALLET_UNBINDBANK_SUCCESS, WALLET_UNBINDBANK_FAILURE],
    callAPI: () => {
      const newParams = {
        ...params,
      };
      newParams.password = typeof newParams.password === 'string' ?
        newParams.password : newParams.password.value;
      const password = CryptoJS.AES.encrypt(
        newParams.password,
        key,
        {
          iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
        });
      newParams.password = password.toString();
      return fetch('/storeManage/bankCard/unbind', newParams);
    },
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WALLET_CLEARSEARCH]    : (state) => ({
    ...state,
    searchParams: {
      tradeTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
  }),
  [WALLET_TRADEREMARK_REQUEST]    : (state) => ({
    ...state,
    tradeRemarkList: [],
    searchParams: {
      ...state.searchParams,
      tradeRemark: '',
    },
  }),
  [WALLET_TRADEREMARK_SUCCESS]    : (state, action) => ({
    ...state,
    tradeRemarkList: action.data.list,
  }),
  [WALLET_TRADEREMARK_FAILURE]    : (state, action) => {
    if (action.params.tradeTypeId) {
      message.error(action.msg);
    }
    return {
      ...state,
    };
  },
  [WALLET_CHANGESEARCH]    : (state, action) => {
    const { params } = action;
    const { value } = params.tradeTime;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    params.tradeTime.value = array;
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...params,
      },
    };
  },
  [WALLET_GETPHONE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLET_GETPHONE_SUCCESS]    : (state, action) => ({
    ...state,
    getStorePhone: action.data.phone,
    record: {
      ...state.record,
      phone: `您当前绑定的手机号为${action.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
    },
  }),
  [WALLET_GETPHONE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLET_PATBILLLIST_REQUEST]: (state) => ({
    ...state,
    listLoading: true,
  }),
  [WALLET_PATBILLLIST_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      data: data.list,
      page: {
        current: data.pageNo,
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        count: data.totalSize,
      },
      listLoading: false,
    };
  },
  [WALLET_PATBILLLIST_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      listLoading: false,
    };
  },
  [WALLET_UNBINDBANK_REQUEST]: (state) => ({
    ...state,
  }),
  [WALLET_UNBINDBANK_SUCCESS]    : (state) => ({
    ...state,
    visibleData: {
      ...state.visibleData,
      visibleUnBank: false,
    },
  }),
  [WALLET_UNBINDBANK_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLET_SENDNOTE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLET_SENDNOTE_SUCCESS]    : (state) => ({
    ...state,
  }),
  [WALLET_SENDNOTE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLET_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [WALLET_SEARCH_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      walletData: data,
    };
  },
  [WALLET_SEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [WALLET_BINDBANKSAVE_REQUEST]    : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [WALLET_BINDBANKSAVE_SUCCESS]    : (state) => {
    message.success('绑定成功');
    return {
      ...state,
      visibleData: {
        ...state.visibleData,
        visibleBank:false,
      },
      confirmLoading: false,
      record: {},
    };
  },
  [WALLET_BINDBANKSAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      errorExplain: action.msg,
      record: action.params,
      confirmLoading: false,
    };
  },
  [WALLET_SETEDITSAVE_REQUEST]    : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [WALLET_SETEDITSAVE_SUCCESS]    : (state) => {
    message.success('设置成功');
    return {
      ...state,
      visibleData: {
        ...state.visibleData,
        visibleSetEdit:false,
      },
      confirmLoading: false,
      record: {},
    };
  },
  [WALLET_SETEDITSAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      errorExplain: action.msg,
      record: {},
      confirmLoading: false,
    };
  },
  [WALLET_FORGETSAVE_REQUEST]    : (state) => ({
    ...state,
  }),
  [WALLET_FORGETSAVE_SUCCESS]    : (state) => {
    message.success('设置成功');
    return {
      ...state,
      visibleData: {
        ...state.visibleData,
        visibleForget: false,
      },
      record: {},
    };
  },
  [WALLET_FORGETSAVE_FAILURE]    : (state, action) => ({
    ...state,
    errorExplain: action.msg,
    record: {
      ...action.params,
    },
  }),
  [WALLET_BANKDETAIL_REQUEST]: (state) => ({
    ...state,
  }),
  [WALLET_BANKDETAIL_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      bindbankData: data,
    };
  },
  [WALLET_BANKDETAIL_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [WALLET_CANCEL]    : (state) => ({
    ...state,
    visibleData: {
      ...state.visibleData,
      visibleBank:false,
      visibleSetEdit: false,
      visibleForget: false,
      visibleUnBank: false,
    },
    errorExplain: '',
    record: {},
  }),
  [WALLET_ONSHAOWMODAL]    : (state, action) => {
    const newState = {
      ...state,
    };
    const visibleData = {
      visibleBank: false,
      visibleSetEdit:false,
      visibleForget:false,
      visibleUnBank: false,
    };
    if (action.params === 'bindBank') {
      visibleData.visibleBank = true;
      newState.record.name = JSON.parse(localStorage.getItem('name'));
    } else if (action.params === 'setEdit') {
      visibleData.visibleSetEdit = true;
    } else if (action.params === 'forget') {
      visibleData.visibleForget = true;
    } else if (action.params === 'unBindbank') {
      visibleData.visibleUnBank = true;
    }
    return {
      ...newState,
      visibleData: {
        ...state.visibleData,
        ...visibleData,
      },
      errorExplain: '',
    };
  },
  [WALLET_CHANGERECORD]    : (state, action) => ({
    ...state,
    errorExplain: '',
    record:{
      ...state.record,
      ...action.params,
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  listLoading: false,
  loading: false,
  visibleData: {
    visibleBank: false,
    visibleSetEdit: false,
    visibleForget: false,
    visibleUnBank: false,
  },
  errorExplain: '',
  getStorePhone: '',
  record: {},
  walletData: {
    hasPassword:false,
    takeOutFlag:false,
    bankCardBinded:false,
    entryMoney: '0.00',
    balance: '0.00',
    receiptMan: '-',
  },
  bindbankData:{
    bankType: '储蓄卡',
    bankNum: '6212261204000735050',
    bank: 'HCCB',
    money: '100',
    phone: '',
  },
  data: [],
  page: {
    current: 1,
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  // 农业、中国、建设、杭州、工商、招商
  bankPicTypeData: {
    ABC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/agricultural_bank%402x.png',
    BOC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/bankofChina%402x.png',
    CCB: '://tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/construction_bank%402x.png',
    HCCB: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/hzbank%402x.png',
    ICBC: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/industrial_commercial_bank%402x.png',
    CMB: '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/merchants_bank%402x.png',
  },
  searchParams: {
    tradeTime: {
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  tradeRemarkList: [],
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
