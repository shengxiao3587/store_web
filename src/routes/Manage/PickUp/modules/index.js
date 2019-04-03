import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const PICKUP_UPDATE_REQUEST = 'PICKUP_UPDATE_REQUEST';
const PICKUP_UPDATE_SUCCESS = 'PICKUP_UPDATE_SUCCESS';
const PICKUP_UPDATE_FAILURE = 'PICKUP_UPDATE_FAILURE';

const PICKUP_CHECKSEARCH_REQUEST = 'PICKUP_CHECKSEARCH_REQUEST';
const PICKUP_CHECKSEARCH_SUCCESS = 'PICKUP_CHECKSEARCH_SUCCESS';
const PICKUP_CHECKSEARCH_FAILURE = 'PICKUP_CHECKSEARCH_FAILURE';

const PICKUP_SEARCHSTORESTATUS_REQUEST = 'PICKUP_SEARCHSTORESTATUS_REQUEST';
const PICKUP_SEARCHSTORESTATUS_SUCCESS = 'PICKUP_SEARCHSTORESTATUS_SUCCESS';
const PICKUP_SEARCHSTORESTATUS_FAILURE = 'PICKUP_SEARCHSTORESTATUS_FAILURE';

const PICKUP_DETAILSTORESTATUS_REQUEST = 'PICKUP_DETAILSTORESTATUS_REQUEST';
const PICKUP_DETAILSTORESTATUS_SUCCESS = 'PICKUP_DETAILSTORESTATUS_SUCCESS';
const PICKUP_DETAILSTORESTATUS_FAILURE = 'PICKUP_DETAILSTORESTATUS_FAILURE';

const PICKUP_ORDERCHANGE_REQUEST = 'PICKUP_ORDERCHANGE_REQUEST';
const PICKUP_ORDERCHANGE_SUCCESS = 'PICKUP_ORDERCHANGE_SUCCESS';
const PICKUP_ORDERCHANGE_FAILURE = 'PICKUP_ORDERCHANGE_FAILURE';

const PICKUP_SAVE_REQUEST = 'PICKUP_SAVE_REQUEST';
const PICKUP_SAVE_SUCCESS = 'PICKUP_SAVE_SUCCESS';
const PICKUP_SAVE_FAILURE = 'PICKUP_SAVE_FAILURE';

const PICKUP_APPLYAGAIN = 'PICKUP_APPLYAGAIN';
const PICKUP_MODALSHOW = 'PICKUP_MODALSHOW';
const PICKUP_MODALHIDDEN = 'PICKUP_MODALHIDDEN';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  // 取件号设置、取件通知方式更新
  update: (params) => ({
    types: [PICKUP_UPDATE_REQUEST, PICKUP_UPDATE_SUCCESS, PICKUP_UPDATE_FAILURE],
    callAPI: () => fetch('/storeManage/store/areaNumType/update', params),
    payload: { params },
  }),
  // 预约配送的开启或关闭，寄件的开启和关闭
  orderChange: (params) => {
    const url = params.flag === 'sender' ?
      '/storeManage/store/send/setting' :
      '/storeManage/store/appointment/setting';
    return {
      types: [PICKUP_ORDERCHANGE_REQUEST, PICKUP_ORDERCHANGE_SUCCESS, PICKUP_ORDERCHANGE_FAILURE],
      callAPI: () => fetch(url, params),
      payload: { params },
    };
  },
  // 门店营业或停业申请
  save: (params) => ({
    types: [PICKUP_SAVE_REQUEST, PICKUP_SAVE_SUCCESS, PICKUP_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/workFlow/Apply', params),
  }),
  // 取件号设置、取件通知方式、服务能力设置查询
  checkSearch: () => ({
    types: [PICKUP_CHECKSEARCH_REQUEST, PICKUP_CHECKSEARCH_SUCCESS, PICKUP_CHECKSEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/store/areaNumType/check'),
  }),
  // 门店营业或停业查询
  searchStoreStatus: () => ({
    types: [PICKUP_SEARCHSTORESTATUS_REQUEST, PICKUP_SEARCHSTORESTATUS_SUCCESS, PICKUP_SEARCHSTORESTATUS_FAILURE],
    callAPI: () => fetch('/storeManage/operateSetting/query'),
  }),
  // 门店营业设置审核失败或审核成功的详情
  detailStoreStatus: () => ({
    types: [PICKUP_DETAILSTORESTATUS_REQUEST, PICKUP_DETAILSTORESTATUS_SUCCESS, PICKUP_DETAILSTORESTATUS_FAILURE],
    callAPI: () => fetch('/storeManage/operateStatus/detail'),
  }),
  // 弹窗出现
  modalShow: createAction(PICKUP_MODALSHOW, 'applyStatus'),
  // 审核失败时候重新审核，更改的数据只是本地的，再次请求就会恢复到审核失败的状态
  applyAgain: createAction(PICKUP_APPLYAGAIN, 'applyStatus'),
  cancel: createAction(PICKUP_MODALHIDDEN),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PICKUP_APPLYAGAIN]    : (state) => ({
    ...state,
    storeStatus: {
      ...state.storeStatus,
      processStatus: 0,
    },
    record:{},
  }),
  [PICKUP_MODALSHOW]    : (state, action) => ({
    ...state,
    modalVisible: true,
    applyStatus: action.applyStatus,
    exitData: {
      ...state.exitData,
      modalData: {
        ...state.exitData.modalData,
        cusTitle: action.applyStatus ? '暂定营业' : '开始营业',
      },
    },
  }),
  [PICKUP_MODALHIDDEN]    : (state) => ({
    ...state,
    modalVisible: false,
  }),
  [PICKUP_UPDATE_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PICKUP_UPDATE_SUCCESS]    : (state, action) => {
    message.success('操作成功');
    return {
      ...state,
      setType: {
        ...state.setType,
        ...action.params,
      },
      loading: false,
    };
  },
  [PICKUP_UPDATE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PICKUP_SAVE_REQUEST]    : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [PICKUP_SAVE_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      confirmLoading: false,
      modalVisible: false,
    };
  },
  [PICKUP_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      confirmLoading: false,
    };
  },
  [PICKUP_ORDERCHANGE_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PICKUP_ORDERCHANGE_SUCCESS]    : (state, action) => {
    message.success('操作成功');
    return {
      ...state,
      setType: {
        ...state.setType,
        ...action.params,
      },
      loading: false,
    };
  },
  [PICKUP_ORDERCHANGE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [PICKUP_CHECKSEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PICKUP_CHECKSEARCH_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      setType: {
        ...state.setType,
        ...data,
      },
      loading: false,
    };
  },
  [PICKUP_CHECKSEARCH_FAILURE]    : (state) => ({
    ...state,
    loading: false,
  }),
  [PICKUP_SEARCHSTORESTATUS_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PICKUP_SEARCHSTORESTATUS_SUCCESS]    : (state, action) => {
    const { data } = action;
    localStorage.setItem('isRunFlag', data.operation);
    return {
      ...state,
      storeStatus: {
        ...state.storeStatus,
        ...data,
      },
      loading: false,
    };
  },
  [PICKUP_SEARCHSTORESTATUS_FAILURE]    : (state) => ({
    ...state,
    loading: false,
  }),
  [PICKUP_DETAILSTORESTATUS_REQUEST]    : (state) => ({
    ...state,
  }),
  [PICKUP_DETAILSTORESTATUS_SUCCESS]    : (state, action) => {
    const { data } = action;
    return {
      ...state,
      record: {
        reason: data.applyReason,
        failureReason: data.failureReason,
        applyTime: DateUtil.formatDate(data.applyTime),
      },
    };
  },
  [PICKUP_DETAILSTORESTATUS_FAILURE]    : (state) => ({
    ...state,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  // 判断是停业申请还是营业申请，1为停业申请，0为营业申请
  applyStatus:1,
  modalVisible: false,
  confirmLoading: false,
  record:{
    applyTime: '',
    reason: '',
  },
  setType: {
    areaNumType: 0,
    pickUpType: 0,
    distributionProcessStatus: 0,
    distributionOpenFlag: 1,
    sendProcessStatus: 0,
    sendOpenFlag: 1,
  },
  storeStatus: {
    operation: 0,
    processStatus: 1,
  },
  loading: false,
  areaNumData: {
    title: '取件号设置',
    // 设置的请求type,区分设置
    type:'areaNumType',
    downData:[
      {
        href: 'http://tubobo-sc.oss-cn-shanghai.aliyuncs.com/express/static/barcode4shelf.pdf',
        content: '普通货架条形码下载',
        fileName: '货架条形码',
      },
      {
        href: 'http://tubobo-qa.oss-cn-shanghai.aliyuncs.com/express/static/barcode4shelf1513658990493-901-999.pdf',
        content: '大件货架条形码下载',
        fileName: '货架条形码',
      },
    ],
    // 图片展示：0、3:选中；1、4：鼠标移上去；2、5：未选中
    picData: [
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Goodsshelves-y@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Goodsshelves-h@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Goodsshelves@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/number-y@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/number-h@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/number@3x.png',
    ],
    // 对上面操作的说明标题。
    titleData: [
      '架排模式',
      '数字模式',
    ],
    // 对上面操作的说明详情；
    stateData: [
      {
        statement: '取件号设置说明:',
        first: '1.架排模式：取件号由架-排-XXXX，其中XXXX为运单号后四位。',
        second: '2.数字模式：取件号由1-6位任意数字组成，后续其他入库件的取件号均递增1。',
      },
      {
        statement: '条形码说明:',
        first: '大件货架用来标记大件货物，在用户发起预约配送时将加收大件包裹配送服务费用',
      },
    ],
  },
  pickUpData: {
    title: '取件通知设置',
    type:'pickUpType',
    downData: [],
    picData: [
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat&message-y@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat&message-h@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat&message@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat-y@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat-h@3x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/WeChat@3x.png',
    ],
    titleData: [
      '微信+短信',
      '仅微信',
    ],
    stateData: [
      {
        statement: '取件通知设置说明：',
        first:'1.微信+短信通知：将通过微信通知用户取件、出库配送、签收等节点信息，短信通知用户含取件号的取件信息。',
        second: '2.微信通知：将首先通过微信通知用户取件、出库配送、签收等节点信息，若用户取关兔波波公众号，则发送含取件号的取件短信通知用户。',
      },
    ],
  },
  serverData: {
    title: '预约配送设置',
    type:'orderStatus',
    flag: 'order',
    // 开启：{0：close，1：open};关闭：{2:close, 3: open} 4:审核中；5：审核失败
    picData: [
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Open_two@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Open_one@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/close_unselected%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/close_selected%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Audit@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Auditfailure@2x.png',
    ],
    titleData: [
      '开启预约配送',
      '关闭预约配送',
    ],
    stateData: [
      '服务能力设置说明：',
      '开启[预约配送]通过审核后,用户通过兔波波微信小程序对门店内快递发起配送请求，门店及社区骑手将提供快递配送上门的服务并享有一定的报酬',
      '关闭[预约配送]审核通过后，门店将暂停向用户提供配送快递的服务，重新开启需要再次审核',
    ],
    reminderData: {
      open: '开启[预约配送]后，门店及社区骑手将对微信用户<br />提供配送快递的服务 ，是否确认开启？',
      close: '关闭[预约配送]后，门店将不对微信用户提供配送<br />快递的服务,是否确认关闭？',
    },
  },
  senderData: {
    title: '寄件服务设置',
    type:'orderStatus',
    flag: 'sender',
    // 开启：{0：close，1：open};关闭：{2:close, 3: open} 4:审核中；5：审核失败
    picData: [
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/OpenMail02%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/OpenMail01%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/CloseMail01%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/CloseMail02%402x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Audit@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Auditfailure@2x.png',
    ],
    titleData: [
      '开启寄件服务',
      '关闭寄件服务',
    ],
    stateData: [
      '服务能力设置说明：',
      '开启【寄件服务】通过审核后，用户通过兔波波微信小程序对门店发起上门揽件请求或直接到兔波波门店寄件，门店将提供上门揽件收件的服务并享有一定的报酬或者为到店用户提供寄件服务',
      '关闭【寄件服务】通过审核后，门店将暂停向用户提供寄件的服务，重新开启需要再次审核',
    ],
    reminderData: {
      open: '开启[寄件服务]后，门店将对用户提供寄件服务(上<br />门揽件、用户到店寄件)，是否确认开启？',
      close: '关闭[寄件服务]后，门店将不对兔波波用户提供寄<br />件服务(上门揽件、用户到店寄件)，是否确认关闭？',
    },
  },
  exitData: {
    title: '营业设置',
    type:'operationStatus',
    // 开启：{0：close，1：open};关闭：{2:close, 3: open} 4:审核中；5：审核失败
    picData: [
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/open2@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/open1@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/close2@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/close1@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Audit@2x.png',
      '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Auditfailure@2x.png',
    ],
    titleData: [
      '开始营业',
      '暂停营业',
    ],
    stateData: [
      '营业设置说明：',
      '1.开始营业：门店当前处于正常营业状态。',
      '2.暂停营业：当遇节假日或不可抗力需要临时关店，门店可选择该项暂停营业。',
    ],
    reminderData: {
      open: '开启[预约配送]后，门店及社区骑手将对微信用户<br />提供配送快递的服务 ，是否确认开启？',
      close: '关闭[预约配送]后，门店将不对微信用户提供配送<br />快递的服务,是否确认关闭？',
    },
    modalData: {
      footerButton: true,
      cusTitle: '营业',
      buttonText: '重新申请',
    },
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
