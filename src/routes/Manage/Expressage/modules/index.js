import { message } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import 'moment/locale/zh-cn';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';

// ------------------------------------
// Constants
// ------------------------------------
const EXPRESSAGE_SEARCH_REQUEST = 'EXPRESSAGE_SEARCH_REQUEST';
const EXPRESSAGE_SEARCH_SUCCESS = 'EXPRESSAGE_SEARCH_SUCCESS';
const EXPRESSAGE_SEARCH_FAILURE = 'EXPRESSAGE_SEARCH_FAILURE';

const EXPRESSAGE_SAVE_REQUEST = 'EXPRESSAGE_SAVE_REQUEST';
const EXPRESSAGE_SAVE_SUCCESS = 'EXPRESSAGE_SAVE_SUCCESS';
const EXPRESSAGE_SAVE_FAILURE = 'EXPRESSAGE_SAVE_FAILURE';

const EXPRESSAGE_SENDNOTE_REQUEST = 'EXPRESSAGE_SENDNOTE_REQUEST';
const EXPRESSAGE_SENDNOTE_SUCCESS = 'EXPRESSAGE_SENDNOTE_SUCCESS';
const EXPRESSAGE_SENDNOTE_FAILURE = 'EXPRESSAGE_SENDNOTE_FAILURE';

const EXPRESSAGE_SELECTSEARCH = 'EXPRESSAGE_SELECTSEARCH';

const EXPRESSAGE_EDITRECORD_REQUEST = 'EXPRESSAGE_EDITRECORD_REQUEST';
const EXPRESSAGE_EDITRECORD_SUCCESS = 'EXPRESSAGE_EDITRECORD_SUCCESS';
const EXPRESSAGE_EDITRECORD_FAILURE = 'EXPRESSAGE_EDITRECORD_FAILURE';

const EXPRESSAGE_SIGN_REQUEST = 'EXPRESSAGE_SIGN_REQUEST';
const EXPRESSAGE_SIGN_SUCCESS = 'EXPRESSAGE_SIGN_SUCCESS';
const EXPRESSAGE_SIGN_FAILURE = 'EXPRESSAGE_SIGN_FAILURE';
const EXPRESSAGE_CLEARSEARCH = 'EXPRESSAGE_CLEARSEARCH';
const EXPRESSAGE_MODALSHOW = 'EXPRESSAGE_MODALSHOW';
const EXPRESSAGE_MODALHIDDEN = 'EXPRESSAGE_MODALHIDDEN';

const EXPRESSAGE_GETBINDMAN_REQUEST = 'EXPRESSAGE_GETBINDMAN_REQUEST';
const EXPRESSAGE_GETBINDMAN_SUCCESS = 'EXPRESSAGE_GETBINDMAN_SUCCESS';
const EXPRESSAGE_GETBINDMAN_FAILURE = 'EXPRESSAGE_GETBINDMAN_FAILURE';

const EXPRESSAGE_EXPORT_REQUEST = 'EXPRESSAGE_EXPORT_REQUEST';
const EXPRESSAGE_EXPORT_SUCCESS = 'EXPRESSAGE_EXPORT_SUCCESS';
const EXPRESSAGE_EXPORT_FAILURE = 'EXPRESSAGE_EXPORT_FAILURE';

const EXPRESSAGE_CHECKBLANCE_SUCCESS = 'EXPRESSAGE_CHECKBLANCE_SUCCESS';
const EXPRESSAGE_CHECKBLANCE_FAILURE = 'EXPRESSAGE_CHECKBLANCE_FAILURE';
const EXPRESSAGE_CHECKBLANCE_REQUEST = 'EXPRESSAGE_CHECKBLANCE_REQUEST';

const EXPRESSAGE_CHANGERECORD = 'EXPRESSAGE_CHANGERECORD';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(EXPRESSAGE_CLEARSEARCH),
  modalShow: createAction(EXPRESSAGE_MODALSHOW, 'keys', 'recordWaybillNo'),
  changeSearch: createAction(EXPRESSAGE_SELECTSEARCH, 'fields'),
  cancel: createAction(EXPRESSAGE_MODALHIDDEN),
  editRecord: (params) => ({
    types: [EXPRESSAGE_EDITRECORD_REQUEST, EXPRESSAGE_EDITRECORD_SUCCESS, EXPRESSAGE_EDITRECORD_FAILURE],
    callAPI: () => fetch('/storeManage/express/detail', params),
  }),
  sign: (params) => ({
    types: [EXPRESSAGE_SIGN_REQUEST, EXPRESSAGE_SIGN_SUCCESS, EXPRESSAGE_SIGN_FAILURE],
    callAPI: () => fetch('/storeManage/express/sign', params),
  }),
  search: (params) => {
    const pageSize = params.pageSize || 10;
    const pageNo = params.pageNo || 1;

    const paramsTemp = {
      ...params,
      pageNo,
      pageSize,
    };
    return {
      types: [EXPRESSAGE_SEARCH_REQUEST, EXPRESSAGE_SEARCH_SUCCESS, EXPRESSAGE_SEARCH_FAILURE],
      callAPI: () => fetch('/storeManage/express/list', paramsTemp),
    };
  },
  save: (params) => ({
    types: [EXPRESSAGE_SAVE_REQUEST, EXPRESSAGE_SAVE_SUCCESS, EXPRESSAGE_SAVE_FAILURE],
    callAPI: (state) => {
      const paramsTemp = {
        ...params,
        waybillNo: state.Expressage.uniqueWaybillNo,
        returnReason: params.returnReason && parseInt(params.returnReason, 10),
      };
      let url;
      const { keys, areaNumType, lastFour } = state.Expressage;
      if (keys === '1') {
        let { areaNum } = params;
        if (areaNum.value !== undefined) {
          areaNum = areaNum.value;
        }
        url = '/storeManage/express/updatestatus';
        if (areaNumType === 0) {
          if (/^[a-zA-Z]*$/.test(areaNum.substring(0, areaNum.length - 1))) {
            paramsTemp.areaNum = `${areaNum}-${lastFour}`;
          } else {
            paramsTemp.areaNum = `${areaNum.substring(0, areaNum.length - 1)}-` +
              `${areaNum.substring(areaNum.length - 1)}-${lastFour}`;
          }
        }
        delete paramsTemp.bindMan;
      } else {
        url = '/storeManage/express/returnback';
      }
      return fetch(url, paramsTemp);
    },
  }),
  sendNote: (params, flag) => {
    const url = params.update && params.update.value ?
      '/storeManage/express/sendSmsBatch' :
      '/storeManage/express/sendSms';
    return {
      types: [EXPRESSAGE_SENDNOTE_REQUEST, EXPRESSAGE_SENDNOTE_SUCCESS, EXPRESSAGE_SENDNOTE_FAILURE],
      callAPI: () => fetch(url, params),
      payload: {
        flag,
      },
    };
  },
  // 获取快递公司绑定的合作对象
  getBindMan: (params) => ({
    types: [EXPRESSAGE_GETBINDMAN_REQUEST, EXPRESSAGE_GETBINDMAN_SUCCESS, EXPRESSAGE_GETBINDMAN_FAILURE],
    callAPI: () => fetch('/storeManage/express/storeCooperation', params),
    payload: params,
  }),
  exportExpressage: (params) => ({
    types: [
      EXPRESSAGE_EXPORT_REQUEST, EXPRESSAGE_EXPORT_SUCCESS, EXPRESSAGE_EXPORT_FAILURE,
    ],
    callAPI: () => fetch('/storeManage/express/list/export', params).then((json) => {
      if (!!json && typeof json === 'object' && json.constructor === Blob) {
        const downloadUrl = URL.createObjectURL(json);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '包裹列表.xlsx';
        document.body.appendChild(a);
        a.click();
        return { resultCode:'0' };
      }
      return json;
    }),
  }),
  checkBlance: (params) => ({
    types: [EXPRESSAGE_CHECKBLANCE_REQUEST, EXPRESSAGE_CHECKBLANCE_SUCCESS, EXPRESSAGE_CHECKBLANCE_FAILURE],
    callAPI: () => fetch('/storeManage/express/isCourierBalFull', params),
  }),
  changeRecord: createAction(EXPRESSAGE_CHANGERECORD, 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [EXPRESSAGE_GETBINDMAN_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_GETBINDMAN_SUCCESS]: (state, action) => {
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
    const recordEdit = {
      ...newState.recordEdit,
      expressCompanyId: action.expressCompanyId,
    };
    if (action.editFlag !== 'editFlag') {
      recordEdit.bindManId = list[0].value;
    }
    return {
      ...newState,
      bindData: newData,
      recordEdit,
    };
  },
  [EXPRESSAGE_GETBINDMAN_FAILURE]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_EDITRECORD_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_EDITRECORD_SUCCESS]: (state, action) => {
    const { data } = action;
    const areaNumArr = data.areaNum.split('-');
    let areaNum;
    let areaNumType;
    if (areaNumArr.length === 3) {
      areaNum = areaNumArr[0] + areaNumArr[1];
      areaNumType = 0;
    } else if (areaNumArr.length === 2) {
      areaNum = areaNumArr[0];
      areaNumType = 0;
    } else {
      areaNum = areaNumArr[0];
      areaNumType = 1;
    }
    const lastFour = areaNumArr[areaNumArr.length - 1];
    return {
      ...state,
      recordEdit: {
        ...data,
        expressCompanyId: data.expressCompany,
        areaNum,
        oldBindManId:data.bindManId,
      },
      modalVisible: true,
      lastFour,
      areaNumType,
    };
  },
  [EXPRESSAGE_EDITRECORD_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      modalVisible: false,
    };
  },
  [EXPRESSAGE_SIGN_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_SIGN_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
    };
  },
  [EXPRESSAGE_SIGN_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EXPRESSAGE_SEARCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [EXPRESSAGE_SEARCH_SUCCESS]: (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const { list } = data;

    newState.data = [];
    for (let i = 0; i < list.length; i += 1) {
      const updateTime = list[i].updateTime && DateUtil.formatDate(list[i].updateTime, 'yyyy-MM-dd HH:mm');
      newState.data.push({
        id: list[i].waybillNo + i,
        areaNum: list[i].areaNum,
        expressCompanyId: list[i].expressCompany,
        operatorId: list[i].operator,
        receiverPhone: list[i].receiverPhone,
        remainDay: list[i].remainDay,
        updateTime,
        waybillNo: list[i].waybillNo,
        waybillStatus: list[i].waybillStatus,
        pickupType: list[i].pickupType,
        bindMan: list[i].bindMan,
      });
    }

    return {
      ...newState,
      loading:false,
      page:{
        ...newState.page,
        current:data.pageNo,
        count:data.totalSize,
        pageNo: data.pageNo,
        pageSize: 10,
      },
    };
  },
  [EXPRESSAGE_SEARCH_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [EXPRESSAGE_SAVE_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_SAVE_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      modalVisible: false,
      returnData: [],
      tempSelectData:[],
    };
  },
  [EXPRESSAGE_SAVE_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EXPRESSAGE_SENDNOTE_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_SENDNOTE_SUCCESS]: (state, action) => {
    if (action.flag === 'all') {
      message.warning('仅支持所有已入库运单！', 3);
    }
    message.success('操作成功');
    return {
      ...state,
    };
  },
  [EXPRESSAGE_SENDNOTE_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EXPRESSAGE_SELECTSEARCH]: (state, action) => {
    const newState = { ...state };
    const { fields } = action;
    const { value } = fields.update;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    fields.update.value = array;
    return {
      ...newState,
      searchParams : {
        ...state.searchParams,
        ...fields,
      },
    };
  },
  [EXPRESSAGE_CLEARSEARCH]: (state) => ({
    ...state,
    searchParams: {
      pageNo: 1,
      pageSize: 10,
      update:{
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
  }),
  [EXPRESSAGE_MODALSHOW]: (state, action) => {
    const { keys, recordWaybillNo } = action;
    return {
      ...state,
      modalVisible: keys !== '1',
      keys,
      uniqueWaybillNo: recordWaybillNo,
    };
  },
  [EXPRESSAGE_MODALHIDDEN]: (state) => ({
    ...state,
    modalVisible: false,
    returnData: [],
    recordEdit:{},
  }),
  [EXPRESSAGE_EXPORT_REQUEST] : (state) => ({
    ...state,
  }),
  [EXPRESSAGE_EXPORT_SUCCESS]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_EXPORT_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EXPRESSAGE_CHECKBLANCE_REQUEST]: (state) => ({
    ...state,
  }),
  [EXPRESSAGE_CHECKBLANCE_SUCCESS]: (state, action) => ({
    ...state,
    enabled:action.data.enabled,
  }),
  [EXPRESSAGE_CHECKBLANCE_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [EXPRESSAGE_CHANGERECORD]:(state, action) => {
    if (state.keys === '1') {
      return {
        ...state,
        recordEdit:{
          ...state.recordEdit,
          ...action.fields,
        },
      };
    }
    return {
      ...state,
      recordReturn:{
        ...state.recordReturn,
        ...action.fields,
      },
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  // 根据keys来判断是编辑功能还是退出功能, 1为编辑，2为退回
  keys:'2',
  uniqueWaybillNo: '',
  modalVisible: false,
  loading: false,
  data: [],
  companyNameData: [],
  operatorData: [],
  // 合作对象
  bindData:[],
  page: {
    current: 1,
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  searchParams: {
    pageNo: 1,
    pageSize: 10,
    update:{
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  recordReturn: {
    returnReason: '2',
  },
  recordEdit: {},
  startSearchParams: {
    pageNo: 1,
    pageSize: 10,
    update:{
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
  },
  waybillStatusData: {
    0: '已到店',
    1: '已入库',
    2: '已出库',
    3: '已签收',
    5: '已退回',
  },
  remainDayData: [
    ['1', '1天'],
    ['2', '2天'],
    ['3', '3天'],
    ['4', '4天'],
    ['5', '5天'],
    ['6', '6天'],
    ['7', '7天'],
    ['0', '全部'],
  ],
  returnReasonData: [
    ['1', '联系无人'],
    ['2', '超期退回'],
    ['3', '对方拒收'],
    ['4', '错分'],
    ['5', '改地址'],
    ['6', '其他'],
  ],
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
