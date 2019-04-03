import { message } from 'antd';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const PIECEIN_CHANGERECORD = 'PIECEIN_CHANGERECORD';
const PIECEIN_HANDLECANCEL = 'PIECEIN_HANDLECANCEL';
const PIECEIN_RESET = 'PIECEIN_RESET';
const PIECEIN_SAVE_SUCCESS = 'PIECEIN_SAVE_SUCCESS';
const PIECEIN_SAVE_FAILURE = 'PIECEIN_SAVE_FAILURE';
const PIECEIN_SAVE_REQUEST = 'PIECEIN_SAVE_REQUEST';
const PIECEIN_CHANGEKEYCODE = 'PIECEIN_CHANGEKEYCODE';
const PIECEIN_EMITEMPTY = 'PIECEIN_EMITEMPTY';
const PIECEIN_CODESTATUSADD = 'PIECEIN_CODESTATUSADD';
const PIECEIN_CHECKSEARCH_SUCCESS = 'PIECEIN_CHECKSEARCH_SUCCESS';
const PIECEIN_CHECKSEARCH_FAILURE = 'PIECEIN_CHECKSEARCH_FAILURE';
const PIECEIN_CHECKSEARCH_REQUEST = 'PIECEIN_CHECKSEARCH_REQUEST';

const PIECEIN_CHECKPHONE_REQUEST = 'PIECEIN_CHECKPHONE_REQUEST';
const PIECEIN_CHECKPHONE_SUCCESS = 'PIECEIN_CHECKPHONE_SUCCESS';
const PIECEIN_CHECKPHONE_FAILURE = 'PIECEIN_CHECKPHONE_FAILURE';

const PIECEIN_GETBINDMAN_REQUEST = 'PIECEIN_GETBINDMAN_REQUEST';
const PIECEIN_GETBINDMAN_SUCCESS = 'PIECEIN_GETBINDMAN_SUCCESS';
const PIECEIN_GETBINDMAN_FAILURE = 'PIECEIN_GETBINDMAN_FAILURE';

const PIECEIN_CHECKBLANCE_SUCCESS = 'PIECEIN_CHECKBLANCE_SUCCESS';
const PIECEIN_CHECKBLANCE_FAILURE = 'PIECEIN_CHECKBLANCE_FAILURE';
const PIECEIN_CHECKBLANCE_REQUEST = 'PIECEIN_CHECKBLANCE_REQUEST';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  // 做节流，将codestatus的变为2，在一定时间内不会重复实现
  codeStatusAdd: createAction(PIECEIN_CODESTATUSADD),
  // 中文输入法下输入的数据会被清空，节流codeStatus变为初始值
  changeKeyCode: createAction(PIECEIN_CHANGEKEYCODE, 'params'),
  // 手写的input框实现清除input数据的功能
  emitEmpty: createAction(PIECEIN_EMITEMPTY, 'value'),
  // 输入数据时同时关联
  changeRecord: createAction(PIECEIN_CHANGERECORD, 'params'),
  // 标记用户关闭弹窗
  handleCancel: createAction(PIECEIN_HANDLECANCEL, 'params'),
  reset: createAction(PIECEIN_RESET),
  // 入库操作
  save: (params) => ({
    types: [PIECEIN_SAVE_REQUEST, PIECEIN_SAVE_SUCCESS, PIECEIN_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/express/in', params),
    payload: { params },
  }),
  // 当前采用架排模式入库还是数字模式入库
  checkSearch: () => ({
    types: [PIECEIN_CHECKSEARCH_REQUEST, PIECEIN_CHECKSEARCH_SUCCESS, PIECEIN_CHECKSEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/store/areaNumType/check'),
  }),
  // 是否是标记用户
  checkPhone: (params) => ({
    types: [PIECEIN_CHECKPHONE_REQUEST, PIECEIN_CHECKPHONE_SUCCESS, PIECEIN_CHECKPHONE_FAILURE],
    callAPI: () => fetch('/storeManage/blackUser/check', params),
  }),
  // 获取快递公司绑定的合作对象
  getBindMan: (params) => ({
    types: [PIECEIN_GETBINDMAN_REQUEST, PIECEIN_GETBINDMAN_SUCCESS, PIECEIN_GETBINDMAN_FAILURE],
    callAPI: () => fetch('/storeManage/express/storeCooperation', params),
  }),
  // 检查当前快递员账户余额是否允许入库
  checkBlance: (params) => ({
    types: [PIECEIN_CHECKBLANCE_REQUEST, PIECEIN_CHECKBLANCE_SUCCESS, PIECEIN_CHECKBLANCE_FAILURE],
    callAPI: () => fetch('/storeManage/express/isCourierBalFull', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PIECEIN_CHECKSEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PIECEIN_CHECKSEARCH_SUCCESS]    : (state, action) => ({
    ...state,
    areaNumType: action.data.areaNumType,
    loading: false,
  }),
  [PIECEIN_CHECKSEARCH_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PIECEIN_CHECKPHONE_REQUEST]    : (state) => ({
    ...state,
  }),
  [PIECEIN_CHECKPHONE_SUCCESS]    : (state, action) => ({
    ...state,
    visible: true,
    fieldsTempData: {
      ...action.data,
    },
  }),
  [PIECEIN_CHECKPHONE_FAILURE]    : (state) => ({
    ...state,
  }),
  [PIECEIN_GETBINDMAN_REQUEST]    : (state) => ({
    ...state,
  }),
  [PIECEIN_GETBINDMAN_SUCCESS]    : (state, action) => {
    const newState = {
      ...state,
    };
    const {
      list,
    } = action.data;
    const newData = [];

    for (let i = 0; i < list.length; i += 1) {
      newData.push({
        ...list[i],
        disabled: list[i] && !list[i].disabled,
      });
    }
    return {
      ...newState,
      bindData: newData,
      data: {
        ...newState.data,
        bindManId: list[0].value,
      },
    };
  },
  [PIECEIN_GETBINDMAN_FAILURE]    : (state) => ({
    ...state,
  }),
  [PIECEIN_SAVE_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PIECEIN_SAVE_SUCCESS]    : (state, action) => {
    const newState = {
      ...state,
    };
    message.success('操作成功');
    if (newState.areaNumType === 1) {
      if (newState.data.areaNum.value === '999999') {
        message.warning('请重新设置初始取件号数字', 2);
      } else {
        newState.data.areaNum.value = `${+(newState.data.areaNum.value) + 1}`;
      }
      newState.numberStore = {
        expressCompanyId: action.params.expressCompanyId || '',
        areaNum: newState.data.areaNum.value || '',
        bindManId: newState.data.bindManId.value || '',
      };
    }
    if (newState.areaNumType === 0) {
      newState.shelfStore = {
        expressCompanyId: action.params.expressCompanyId || '',
        areaNum: newState.data.areaNum.value || '',
        bindManId: newState.data.bindManId.value || '',
      };
    }
    return {
      ...newState,
      data: {
        ...newState.data,
        waybillNo: '',
        receiverPhone: '',
        lastFour: '',
      },
      loading: false,
    };
  },
  [PIECEIN_SAVE_FAILURE]    : (state, action) => {
    const newState = {
      ...state,
      loading: false,
    };
    let { msg } = action;
    if (action.msgCode === '31' || action.msgCode === '37') {
      msg = '该运单未入库，请将快递入库';
    }
    if (action.msgCode === '33') {
      msg = '该运单已入库, 请勿重复操作';
    }
    message.error(msg);
    return newState;
  },
  [PIECEIN_CHANGERECORD]    : (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.params,
    },
  }),
  [PIECEIN_HANDLECANCEL]    : (state) => ({
    ...state,
    visible: false,
  }),
  [PIECEIN_RESET]    : (state) => {
    let status = {};
    if (state.areaNumType === 1) {
      status = {
        ...state.numberStore,
      };
    }
    if (state.areaNumType === 0) {
      status = {
        ...state.shelfStore,
      };
    }
    return {
      ...state,
      data: {
        ...status,
        waybillNo: '',
        receiverPhone: '',
      },
      loading: false,
    };
  },
  [PIECEIN_EMITEMPTY]    : (state, action) => ({
    ...state,
    data: {
      ...state.data,
      [action.value]: '',
    },
  }),
  [PIECEIN_CODESTATUSADD]    : (state) => ({
    ...state,
    codeStatus: 2,
  }),
  [PIECEIN_CHANGEKEYCODE]    : (state, action) => ({
    ...state,
    codeStatus: 1,
    data: {
      ...state.data,
      [action.params]: '',
    },
  }),
  [PIECEIN_CHECKBLANCE_REQUEST]    : (state) => ({
    ...state,
  }),
  [PIECEIN_CHECKBLANCE_SUCCESS]    : (state, action) => ({
    ...state,
    enabled:action.data.enabled,
  }),
  [PIECEIN_CHECKBLANCE_FAILURE]    : (state, action) => {
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
  // 弹窗是否展示，标记用户的
  visible: false,
  // 入库信息数据
  data: {},
  loading: false,
  // 做节流，在一定时间内只能请求一次
  codeStatus: 1,
  // 架排模式还是数字模式  0:架排模式 1：数字模式
  areaNumType: 0,
  // 数字模式的保存数据
  numberStore: {},
  // 数字模式的保存数据
  shelfStore: {},
  // 标记用户的数据
  fieldsTempData:{
    phone: '15990357176',
    remark: '这是一个傻蛋！',
    userName: '张三',
  },
  // 合作对象数据
  bindData:[],
  enabled:true,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
