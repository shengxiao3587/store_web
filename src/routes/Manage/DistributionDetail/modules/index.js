import { message } from 'antd';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const DISTRIBUTION_DETAIL_FAILURE = 'DISTRIBUTION_DETAIL_FAILURE';
const DISTRIBUTION_DETAIL_SUCCESS = 'DISTRIBUTION_DETAIL_SUCCESS';
const DISTRIBUTION_DETAIL_REQUEST = 'DISTRIBUTION_DETAIL_REQUEST';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  detail: (params) => ({
    types: [DISTRIBUTION_DETAIL_REQUEST, DISTRIBUTION_DETAIL_SUCCESS, DISTRIBUTION_DETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/appointTask/detail', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTION_DETAIL_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTION_DETAIL_SUCCESS]    : (state, action) => {
    const statusObj = {
      RECEIVE: '待接单',
      PICKUP: '待取货',
      DISTRIBUTION: '配送中',
      FINISH: '已完成',
      CANCEL: '已关闭',
    };
    const cancelReasonObj = {
      GRAB_OVERTIME_CANCEL: '超时未接单取消',
      GRAB_SENDER_CANCEL: '未接单时主动取消',
      PAY_OVERTIME_CANCEL: '支付超时取消',
      ADMIN_CANCEL: '后台取消',
      PAY_SENDER_CANCEL: '未支付主动取消',
      PICK_RIDER_CANCEL: '骑手主动取消',
      PICK_SENDER_CANCEL: '接单后主动取消',
    };
    const taskTrackList = action.data.taskTrackList;
    const detailList = action.data;
    let stepNum = taskTrackList.length;
    let cancelTime = '';
    let status = detailList.distributionStatus;

    // 控制流程条，先做数组长度判断，然后判断最后一位是不是CANCEL取消状态
    if (taskTrackList.length > 0 && taskTrackList[taskTrackList.length - 1].status === 'CANCEL') {
      stepNum = taskTrackList.length - 1;
      cancelTime = taskTrackList[taskTrackList.length - 1].time;
      // 在确定有cancel状态之后，判断下数组是不是包含RECEIVE状态
      if (taskTrackList.length <= 2) {
        status = 'RECEIVE';
      }
    }
    return {
      ...state,
      loading: false,
      data: {
        ...detailList,
        cancelReason: cancelReasonObj[detailList.cancelReason],
        payDistribution: `${detailList.payDistribution}${detailList.payDistribution !== '0.00' ? '（含补贴）' : ''}`,
        receiveDetail: {
          startInput: {
            value: detailList.expressCompany,
          },
          endInput: {
            value: detailList.waybillNo,
          },
        },
        addresseeDetail: {
          startInput: {
            value: `${detailList.receiveName || ''}    ` +
            `${detailList.receivePhone || ''}    ${detailList.receiveAddress || ''}`,
          },
          endInput: {
            value: `配送距离 ${detailList.deliveryDistance || '0.00'} km`,
          },
        },
        riderDetail: `${detailList.riderName || ''}  ${detailList.riderPhone || ''}`,
      },
      distributionStatus: statusObj[detailList.distributionStatus],
      status,
      taskTrackList,
      stepNum,
      cancelTime,
    };
  },
  [DISTRIBUTION_DETAIL_FAILURE]    : (state, action) => {
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
  distributionStatus: '',
  cancelTime: '',
  stepNum: 0,
  taskTrackList: [],
  status: 'RECEIVE',
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
