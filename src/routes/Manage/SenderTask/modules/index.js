import { message } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import 'moment/locale/zh-cn';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------

const SENDERTASK_CHANGETABS = 'SENDERTASK_CHANGETABS';
const SENDERTASK_CHANGESEARCH = 'SENDERTASK_CHANGESEARCH';

const SENDERTASK_SEARCH_FAILURE = 'SENDERTASK_SEARCH_FAILURE';
const SENDERTASK_SEARCH_SUCCESS = 'SENDERTASK_SEARCH_SUCCESS';
const SENDERTASK_SEARCH_REQUEST = 'SENDERTASK_SEARCH_REQUEST';

const SENDERTASK_CLOSE_REQUEST = 'SENDERTASK_CLOSE_REQUEST';
const SENDERTASK_CLOSE_SUCCESS = 'SENDERTASK_CLOSE_SUCCESS';
const SENDERTASK_CLOSE_FAILURE = 'SENDERTASK_CLOSE_FAILURE';

const SENDERTASK_SENDER_REQUEST = 'SENDERTASK_SENDER_REQUEST';
const SENDERTASK_SENDER_SUCCESS = 'SENDERTASK_SENDER_SUCCESS';
const SENDERTASK_SENDER_FAILURE = 'SENDERTASK_SENDER_FAILURE';

const SENDERTASK_CLEARSEARCH = 'SENDERTASK_CLEARSEARCH';
const SENDERTASK_MODALSHOW = 'SENDERTASK_MODALSHOW';
const SENDERTASK_CANCEL = 'SENDERTASK_CANCEL';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  clearSearch: createAction(SENDERTASK_CLEARSEARCH),
  modalShow: createAction(SENDERTASK_MODALSHOW, 'record'),
  cancel: createAction(SENDERTASK_CANCEL),
  tabsChange: createAction(SENDERTASK_CHANGETABS, 'key'),
  changeSearch: createAction(SENDERTASK_CHANGESEARCH, 'record'),
  close: (params) => ({
    types: [SENDERTASK_CLOSE_REQUEST, SENDERTASK_CLOSE_SUCCESS, SENDERTASK_CLOSE_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/cancel', params),
  }),
  senderOrprint: (params) => ({
    types: [SENDERTASK_SENDER_REQUEST, SENDERTASK_SENDER_SUCCESS, SENDERTASK_SENDER_FAILURE],
    callAPI: () => fetch('/storeManage/sendTask/handle', params),
  }),
  search: (params) => ({
    types: [
      SENDERTASK_SEARCH_REQUEST, SENDERTASK_SEARCH_SUCCESS, SENDERTASK_SEARCH_FAILURE,
    ],
    callAPI: (getState) => {
      let sendStatus = 'RECEIVE,PICKUP,HANDLE';
      switch (getState.SenderTask.activeKey) {
        case '0':
          sendStatus = 'RECEIVE,PICKUP,HANDLE';
          break;
        case '1':
          sendStatus = 'SEND';
          break;
        case '2':
          sendStatus = 'FINISH,CANCEL';
          break;
        default:
          break;
      }
      return fetch('/storeManage/sendTask/list', {
        ...params,
        sendStatus,
      });
    },
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SENDERTASK_MODALSHOW]    : (state, action) => {
    const {
      record,
    } = action;
    return ({
      ...state,
      visibleDealWith: record.type === 'dealwith',
      visibleSend: record.type === 'sender',
      appointTaskId: record.appointTaskId,
      printData: record.printData,
    });
  },
  [SENDERTASK_CANCEL]    : (state) => ({
    ...state,
    visibleDealWith: false,
    visibleSend: false,
    appointTaskId: '',
    printData: '',
  }),
  [SENDERTASK_CLEARSEARCH]    : (state) => ({
    ...state,
    searchParams: {
      sendTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    page: {
      pageSize: 10,
      totalSize: 0,
      pageNo: 1,
    },
  }),
  [SENDERTASK_CHANGESEARCH]    : (state, action) => {
    const { record } = action;
    const { value } = record.sendTime;
    const array = value instanceof Array ? value : [value.startValue, value.endValue];
    record.sendTime.value = array;
    return {
      ...state,
      searchParams:{
        ...state.searchParams,
        ...action.record,
      },
    };
  },
  [SENDERTASK_CHANGETABS]    : (state, action) => ({
    ...state,
    activeKey: action.key,
    searchParams: {
      sendTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
    },
    page: {
      pageSize: 10,
      totalSize: 0,
      pageNo: 1,
    },
  }),
  [SENDERTASK_CLOSE_REQUEST]    : (state) => ({
    ...state,
    buttonLoadingData: {
      ...state.buttonLoadingData,
      close: true,
    },
  }),
  [SENDERTASK_CLOSE_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      buttonLoadingData: {
        ...state.buttonLoadingData,
        close: false,
      },
    };
  },
  [SENDERTASK_CLOSE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoadingData: {
        ...state.buttonLoadingData,
        close: false,
      },
    };
  },
  [SENDERTASK_SENDER_REQUEST]    : (state) => ({
    ...state,
    buttonLoadingData: {
      ...state.buttonLoadingData,
      sender: true,
    },
  }),
  [SENDERTASK_SENDER_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      buttonLoadingData: {
        ...state.buttonLoadingData,
        sender: false,
      },
      visibleDealWith: false,
      visibleSend: false,
    };
  },
  [SENDERTASK_SENDER_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoadingData: {
        ...state.buttonLoadingData,
        sender: false,
      },
    };
  },
  [SENDERTASK_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [SENDERTASK_SEARCH_SUCCESS]    : (state, action) => {
    const { data } = action;
    const { list } = data;
    for (let i = 0; i < list.length; i += 1) {
      list[i].id = list[i].appointTaskId;
      list[i].key = list[i].appointTaskId;
      list[i].finishTime = list[i].finishTime ? DateUtil.formatDate(list[i].finishTime, 'yyyy-MM-dd HH:mm:ss') : '-';
      list[i].orderTime = list[i].orderTime ? DateUtil.formatDate(list[i].orderTime, 'yyyy-MM-dd HH:mm:ss') : '-';
    }
    return {
      ...state,
      page: {
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        count: data.totalSize,
      },
      loading: false,
      data: list,
    };
  },
  [SENDERTASK_SEARCH_FAILURE]    : (state, action) => {
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
  // 打印需要的记录id
  appointTaskId: '',
  printData: '',
  buttonLoadingData: {
    close: false,
    send: false,
    print: false,
  },
  data: [],
  // tab的序列号。控制待处理、待寄出、已完成列表字段的展示及搜索。
  activeKey: '0',
  page: {
    pageSize: 10,
    totalSize: 0,
    pageNo: 1,
  },
  searchParams: {
    sendTime: {
      value: [
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    },
    sendStatus: 'RECEIVE,PICKUP,HANDLE',
  },
  sendTypeStatus: [
    {
      value: '0',
      label: '到店',
    },
    {
      value: '1',
      label: '上门',
    },
  ],
  paidFlagStatus: [
    {
      value: '0',
      label: '未付款',
    },
    {
      value: '2',
      label: '已付款',
    },
  ],
  visibleDealWith: false,
  visibleSend: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
