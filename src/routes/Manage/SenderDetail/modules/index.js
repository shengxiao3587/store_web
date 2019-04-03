import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const SENDERDETAIL_DETAIL_FAILURE = 'SENDERDETAIL_DETAIL_FAILURE';
const SENDERDETAIL_DETAIL_SUCCESS = 'SENDERDETAIL_DETAIL_SUCCESS';
const SENDERDETAIL_DETAIL_REQUEST = 'SENDERDETAIL_DETAIL_REQUEST';
const SENDERDETAIL_PRICE_FAILURE = 'SENDERDETAIL_PRICE_FAILURE';
const SENDERDETAIL_PRICE_SUCCESS = 'SENDERDETAIL_PRICE_SUCCESS';
const SENDERDETAIL_PRICE_REQUEST = 'SENDERDETAIL_PRICE_REQUEST';
const SENDERDETAIL_SAVE_FAILURE = 'SENDERDETAIL_SAVE_FAILURE';
const SENDERDETAIL_SAVE_SUCCESS = 'SENDERDETAIL_SAVE_SUCCESS';
const SENDERDETAIL_SAVE_REQUEST = 'SENDERDETAIL_SAVE_REQUEST';
const SENDERDETAIL_HANDLE_FAILURE = 'SENDERDETAIL_HANDLE_FAILURE';
const SENDERDETAIL_HANDLE_SUCCESS = 'SENDERDETAIL_HANDLE_SUCCESS';
const SENDERDETAIL_HANDLE_REQUEST = 'SENDERDETAIL_HANDLE_REQUEST';

const SENDERDETAIL_BUTTONSTATUS = 'SENDERDETAIL_BUTTONSTATUS';
const SENDERDETAIL_CHANGERECORD = 'SENDERDETAIL_CHANGERECORD';
const SENDERDETAIL_MODALSTATUS = 'SENDERDETAIL_MODALSTATUS';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  buttonStatus: createAction(SENDERDETAIL_BUTTONSTATUS, 'params'),
  modalStatus: createAction(SENDERDETAIL_MODALSTATUS, 'params'),
  changeRecord: createAction(SENDERDETAIL_CHANGERECORD, 'record'),
  handle: (params) => ({
    types: [SENDERDETAIL_HANDLE_REQUEST, SENDERDETAIL_HANDLE_SUCCESS, SENDERDETAIL_HANDLE_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/handle', params),
  }),
  detail: (params) => ({
    types: [SENDERDETAIL_DETAIL_REQUEST, SENDERDETAIL_DETAIL_SUCCESS, SENDERDETAIL_DETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/detail', params),
    payload: { params },
  }),
  price: (params) => ({
    types: [SENDERDETAIL_PRICE_REQUEST, SENDERDETAIL_PRICE_SUCCESS, SENDERDETAIL_PRICE_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/price', params),
  }),
  save: (params) => ({
    types: [SENDERDETAIL_SAVE_REQUEST, SENDERDETAIL_SAVE_SUCCESS, SENDERDETAIL_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/update', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SENDERDETAIL_MODALSTATUS]    : (state, action) => ({
    ...state,
    ...action.params,
  }),
  [SENDERDETAIL_HANDLE_REQUEST]    : (state) => ({
    ...state,
  }),
  [SENDERDETAIL_HANDLE_SUCCESS]    : (state) => ({
    ...state,
  }),
  [SENDERDETAIL_HANDLE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [SENDERDETAIL_SAVE_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [SENDERDETAIL_SAVE_SUCCESS]    : (state, action) => ({
    ...state,
    buttonLoading: false,
    printData: action.data,
  }),
  [SENDERDETAIL_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoading: false,
    };
  },
  [SENDERDETAIL_PRICE_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [SENDERDETAIL_PRICE_SUCCESS]    : (state, action) => ({
    ...state,
    buttonLoading: false,
    data: {
      ...state.data,
      ...action.data,
    },
  }),
  [SENDERDETAIL_PRICE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoading: false,
    };
  },
  [SENDERDETAIL_CHANGERECORD]    : (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.record,
    },
  }),
  [SENDERDETAIL_BUTTONSTATUS]    : (state, action) => ({
    ...state,
    valueObj: {
      ...action.params,
    },
    edition: !action.params.weightValue,
    paper: !(action.params.weightValue && action.params.waybillNoValue),
  }),
  [SENDERDETAIL_DETAIL_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [SENDERDETAIL_DETAIL_SUCCESS]    : (state, action) => {
    const {
      data,
      params,
    } = action;
    return {
      ...state,
      loading: false,
      detailOrEdit: action.params.type === 'detail',
      valueObj: {
        waybillNoValue: false,
        weightValue: data.weight !== '',
      },
      edition: data.weight === '',
      data: {
        ...data,
        senderDetail: `${data.senderProvince}${data.senderCity}${data.senderDistrict}`,
        receiverDetail: `${data.receiverProvince}${data.receiverCity}${data.receiverDistrict}`,
        paid: data.paidFlag === '2',
        finishTime: data.finishTime && DateUtil.formatDate(data.finishTime, 'yyyy-MM-dd HH:mm:ss'),
        remark: params.type === 'edit' ? data.remark : data.remark || '-',
      },
      paidFlag: data.paidFlag,
    };
  },
  [SENDERDETAIL_DETAIL_FAILURE]    : (state, action) => {
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
  data: {},
  detailOrEdit: false,
  valueObj: {
    waybillNoValue: false,
    weightValue: false,
  },
  paper: true,
  edition: true,
  buttonLoading: false,
  // paidFlagList: ['未付款', '待付款', '已付款'],
  paidFlag: '',
  printData: '',
  visible: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
