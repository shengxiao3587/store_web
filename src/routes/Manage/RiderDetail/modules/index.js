import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const RIDERDETAIL_DETAIL_FAILURE = 'RIDERDETAIL_DETAIL_FAILURE';
const RIDERDETAIL_DETAIL_SUCCESS = 'RIDERDETAIL_DETAIL_SUCCESS';
const RIDERDETAIL_DETAIL_REQUEST = 'RIDERDETAIL_DETAIL_REQUEST';
const RIDERDETAIL_AUDIT_REQUEST = 'RIDERDETAIL_AUDIT_REQUEST';
const RIDERDETAIL_AUDIT_SUCCESS = 'RIDERDETAIL_AUDIT_SUCCESS';
const RIDERDETAIL_AUDIT_FAILURE = 'RIDERDETAIL_AUDIT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  audit: (params) => ({
    types: [RIDERDETAIL_AUDIT_REQUEST, RIDERDETAIL_AUDIT_SUCCESS, RIDERDETAIL_AUDIT_FAILURE],
    callAPI: () => fetch('/storeManage/rider/audit', params),
  }),
  detail: (params) => ({
    types: [RIDERDETAIL_DETAIL_REQUEST, RIDERDETAIL_DETAIL_SUCCESS, RIDERDETAIL_DETAIL_FAILURE],
    callAPI: () => fetch('/storeManage/riderInfo/detail', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RIDERDETAIL_AUDIT_REQUEST]    : (state) => ({
    ...state,
    riderButtonLoading: true,
  }),
  [RIDERDETAIL_AUDIT_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      riderButtonLoading: false,
    };
  },
  [RIDERDETAIL_AUDIT_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      riderButtonLoading: false,
    };
  },
  [RIDERDETAIL_DETAIL_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [RIDERDETAIL_DETAIL_SUCCESS]    : (state, action) => {
    const processStatusObj = [{
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
    }];
    let idCardFront;
    let idCardBack;
    if (action.data.idCardFront) {
      idCardFront = [{
        uid: -1,
        name: '身份证正面照',
        url: action.data.idCardFront,
        status: 'done',
      }];
    }

    if (action.data.idCardBack) {
      idCardBack = [{
        uid: -1,
        name: '身份证正面照',
        url: action.data.idCardBack,
        status: 'done',
      }];
    }
    return {
      ...state,
      loading: false,
      buttonProcessStatus: action.data.processStatus,
      processStatus: processStatusObj[action.data.riderDelFlag][action.data.processStatus],
      data: {
        ...action.data,
        idCardBack,
        idCardFront,
        createDate: action.data.createDate && DateUtil.formatDate(action.data.createDate, 'yyyy-MM-dd HH:mm'),
      },

    };
  },
  [RIDERDETAIL_DETAIL_FAILURE]    : (state, action) => {
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
  processStatus: [],
  riderButtonLoading: false,
  buttonProcessStatus: 'INIT',
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
