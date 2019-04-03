import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import fetch from '../../../../util/fetch';
// ------------------------------------
// Constants
// ------------------------------------
const EXPRESSAGEDETAIL_DETAIL_REQUEST = 'EXPRESSAGEDETAIL_DETAIL_REQUEST';
const EXPRESSAGEDETAIL_DETAIL_SUCCESS = 'EXPRESSAGEDETAIL_DETAIL_SUCCESS';
const EXPRESSAGEDETAIL_DETAIL_FAILURE = 'EXPRESSAGEDETAIL_DETAIL_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  detail: (params) => ({
    types: [EXPRESSAGEDETAIL_DETAIL_REQUEST, EXPRESSAGEDETAIL_DETAIL_SUCCESS, EXPRESSAGEDETAIL_DETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/express/detail', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [EXPRESSAGEDETAIL_DETAIL_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [EXPRESSAGEDETAIL_DETAIL_SUCCESS]    : (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const { formatDate } = DateUtil;

    const returnRemark = newState.returnReasonData[data.returnReason] +
      (data.returnRemark ? (`; ${data.returnRemark}`) : '');
    const inTime = (data.inTime && formatDate(data.inTime, 'yyyy-MM-dd HH:mm')) || '-';
    const outTime = (data.outTime && formatDate(data.outTime, 'yyyy-MM-dd HH:mm')) || '-';
    const signTime = (data.signTime && formatDate(data.signTime, 'yyyy-MM-dd HH:mm')) || '-';
    const returnTime = (data.returnTime && formatDate(data.returnTime, 'yyyy-MM-dd HH:mm')) || '-';
    const updateTime = (data.updateTime && formatDate(data.updateTime, 'yyyy-MM-dd HH:mm')) || '-';
    const bindMan = (data.bindMan) ? `${data.bindMan}   ${data.bindManPhone}` : '-';
    newState.data = {
      returnReason: returnRemark,
      waybillNo: data.waybillNo,
      bindMan,
      expressCompany: data.expressCompany,
      receiverPhone: data.receiverPhone,
      areaNum: data.areaNum,
      remainDay: data.remainDay ? (`${data.remainDay}天`) : '-',
      inOperator: data.inOperator,
      inTime,
      outOperator: data.outOperator,
      outTime,
      signOperator: data.signOperator,
      signTime,
      returnOperator: data.returnOperator,
      returnTime,
      updateOperator: data.updateOperator,
      updateTime,
    };

    return {
      ...newState,
      loading: false,
      waybillStatus: data.waybillStatus,
    };
  },
  [EXPRESSAGEDETAIL_DETAIL_FAILURE]: (state, action) => {
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
  returnFlag: true,
  signFlag: false,
  inFlag: false,
  data: [],
  waybillStatusData: {
    0: '已到店',
    1: '已入库',
    2: '已出库',
    3: '已签收',
    5: '已退回',
  },
  returnReasonData: {
    1: '联系无人',
    2: '超期退回',
    3: '对方拒收',
    4: '错分',
    5: '改地址',
    6: '其他',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
