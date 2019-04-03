import { message } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const PERSONALCENTER_SEARCH_SUCCESS = 'PERSONALCENTER_SEARCH_SUCCESS';
const PERSONALCENTER_SEARCH_FAILURE = 'PERSONALCENTER_SEARCH_FAILURE';
const PERSONALCENTER_SEARCH_REQUEST = 'PERSONALCENTER_SEARCH_REQUEST';

const PERSONALCENTER_SAVE_SUCCESS = 'PERSONALCENTER_SAVE_SUCCESS';
const PERSONALCENTER_SAVE_FAILURE = 'PERSONALCENTER_SAVEFAILURE';
const PERSONALCENTER_SAVE_REQUEST = 'PERSONALCENTER_SAVE_REQUEST';

const PERSONALCENTER_INPUTDATA = 'PERSONALCENTER_INPUTDATA';
const PERSONALCENTER_RESETINPUT = 'PERSONALCENTER_RESETINPUT';
const PERSONALCENTER_CHANGERECORD = 'PERSONALCENTER_CHANGERECORD';
const PERSONALCENTER_UPDATESTATUS = 'PERSONALCENTER_UPDATESTATUS';
const PERSONALCENTER_RESET = 'PERSONALCENTER_RESET';
const PERSONALCENTER_STATUS = 'PERSONALCENTER_STATUS';
const PERSONALCENTER_UPDATEVISIBLE = 'PERSONALCENTER_UPDATEVISIBLE';

const PERSONALCENTER_EXIT_SUCCESS = 'PERSONALCENTER_EXIT_SUCCESS';
const PERSONALCENTER_EXIT_FAILURE = 'PERSONALCENTER_EXIT_FAILURE';
const PERSONALCENTER_EXIT_REQUEST = 'PERSONALCENTER_EXIT_REQUEST';
const PERSONALCENTER_EXITNODE_SUCCESS = 'PERSONALCENTER_EXITNODE_SUCCESS';
const PERSONALCENTER_EXITNODE_FAILURE = 'PERSONALCENTER_EXITNODE_FAILURE';
const PERSONALCENTER_EXITNODE_REQUEST = 'PERSONALCENTER_EXITNODE_REQUEST';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  status: createAction(PERSONALCENTER_STATUS),
  reset: createAction(PERSONALCENTER_RESET),
  updateStatus: createAction(PERSONALCENTER_UPDATESTATUS, 'record'),
  updateVisible: createAction(PERSONALCENTER_UPDATEVISIBLE, 'record'),
  resetInput: createAction(PERSONALCENTER_RESETINPUT, 'record'),
  changeRecord: createAction(PERSONALCENTER_CHANGERECORD, 'record'),
  inputDatasource: createAction(PERSONALCENTER_INPUTDATA, 'tips'),
  exitNodeCancel: (params) => ({
    types: [PERSONALCENTER_EXITNODE_REQUEST, PERSONALCENTER_EXITNODE_SUCCESS, PERSONALCENTER_EXITNODE_FAILURE],
    callAPI: () => fetch('/storeManage/quitFail/delete', params),
  }),
  exit: (params) => ({
    types: [PERSONALCENTER_EXIT_REQUEST, PERSONALCENTER_EXIT_SUCCESS, PERSONALCENTER_EXIT_FAILURE],
    callAPI: () => fetch('/storeManage/workFlow/Apply', params),
  }),
  search: (params) => ({
    types: [PERSONALCENTER_SEARCH_REQUEST, PERSONALCENTER_SEARCH_SUCCESS, PERSONALCENTER_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/store/detail', params),
  }),
  save: (params) => ({
    types: [PERSONALCENTER_SAVE_REQUEST, PERSONALCENTER_SAVE_SUCCESS, PERSONALCENTER_SAVE_FAILURE],
    callAPI: () => fetch('/storeManage/storeInfo/edit', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PERSONALCENTER_EXITNODE_REQUEST]    : (state) => ({
    ...state,
  }),
  [PERSONALCENTER_EXITNODE_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
    };
  },
  [PERSONALCENTER_EXITNODE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [PERSONALCENTER_EXIT_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [PERSONALCENTER_EXIT_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      buttonLoading: false,
      modalVisible: false,
    };
  },
  [PERSONALCENTER_EXIT_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoading: false,
    };
  },
  [PERSONALCENTER_UPDATEVISIBLE]    : (state, action) => ({
    ...state,
    ...action.record,
  }),
  [PERSONALCENTER_STATUS]    : (state) => ({
    ...state,
    editStatus: true,
  }),
  [PERSONALCENTER_RESET]    : (state) => ({
    ...state,
    data: {},
    loading: false,
    inputData: [],
    editStatus: true,
    compareData: {},
  }),
  [PERSONALCENTER_SAVE_REQUEST]    : (state) => ({
    ...state,
    buttonLoading: true,
  }),
  [PERSONALCENTER_SAVE_SUCCESS]    : (state) => {
    message.success('操作成功');
    return {
      ...state,
      buttonLoading: false,
      editStatus: true,
    };
  },
  [PERSONALCENTER_SAVE_FAILURE]    : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      buttonLoading: false,
    };
  },
  [PERSONALCENTER_UPDATESTATUS]    : (state) => ({
    ...state,
    editStatus: false,
  }),
  [PERSONALCENTER_RESETINPUT]    : (state, action) => {
    let str = '';
    if (action.record !== undefined) {
      str = action.record.join();
    }
    return {
      ...state,
      data: {
        ...state.data,
        storeAddressDetail: '',
        amap: {
          address: str,
        },
      },
    };
  },
  [PERSONALCENTER_CHANGERECORD]    : (state, action) => {
    let str = '';
    let address = action.record.storeAddressDetail || '';
    let storeDistrict = action.record.storeDistrict || [];
    let lnglat = action.record.amap.value && action.record.amap.value.lngLat;

    if (Object.prototype.toString.call(action.record.storeAddressDetail) === '[object Object]') {
      address = action.record.storeAddressDetail.value || '';
    }
    if (Object.prototype.toString.call(action.record.storeDistrict) === '[object Object]') {
      storeDistrict = action.record.storeDistrict.value || '';
    }
    if (lnglat === undefined) {
      lnglat = state.data.amap.lngLat;
    }

    if (address === '') {
      lnglat = undefined;
    }
    str = storeDistrict.join();
    return {
      ...state,
      data: {
        ...state.record,
        ...action.record,
        amap: {
          lngLat: lnglat,
          address: `${str}${address}`,
        },
      },
    };
  },
  [PERSONALCENTER_INPUTDATA]    : (state, action) => {
    const newState = {
      ...state,
    };
    const list = [];
    action.tips.forEach((item) => {
      list.push(`${item.address} ${item.name}`);
    });
    newState.inputData = list;

    return newState;
  },
  [PERSONALCENTER_SEARCH_REQUEST]    : (state) => ({
    ...state,
    loading: true,
  }),
  [PERSONALCENTER_SEARCH_SUCCESS]    : (state, action) => {
    const {
      data,
    } = action;
    let picUrlStore;
    let picUrlLicense;
    let picUrlOne;
    if (data.picUrlStore) {
      picUrlStore = [{
        uid: -1,
        name: '门店照片',
        url: data.picUrlStore,
        status: 'done',
      }];
    }
    if (data.picUrlLicense) {
      picUrlLicense = [{
        uid: -2,
        name: '门店照片',
        url: data.picUrlLicense,
        status: 'done',
      }];
    }
    if (data.picUrlOne) {
      picUrlOne = [{
        uid: -3,
        name: '门店照片',
        url: data.picUrlOne,
        status: 'done',
      }];
    }

    let wealPolicy;
    if (data.wealPolicy) {
      wealPolicy = {
        ...data.wealPolicy,
        timeStart: DateUtil.formatDate(data.wealPolicy.timeStart),
        timeEnd: DateUtil.formatDate(data.wealPolicy.timeEnd),
      };
    }

    return {
      ...state,
      data: {
        ...data,
        amap: {
          address: `${data.province},${data.city},${data.district}` +
          `${data.storeAddressDetail}`,
          lngLat: [data.longitude, data.latitude],
        },
        serviceTime: {
          serviceTimeEnd: {
            value: moment(data.serviceTimeEnd, 'HH:mm'),
          },
          serviceTimeStart: {
            value: moment(data.serviceTimeStart, 'HH:mm'),
          },
        },
        wealPolicy,
        picUrlStore,
        picUrlLicense,
        picUrlOne,
        storeDistrict: [data.province, data.city, data.district],
      },
      compareData: {
        ...data,
      },
      loading: false,
    };
  },
  [PERSONALCENTER_SEARCH_FAILURE]    : (state, action) => {
    const newState = {
      ...state,
      loading: false,
    };
    message.error(action.msg);
    return newState;
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: {},
  compareData: {},
  loading: false,
  inputData: [],
  editStatus: true,
  modalVisible: false,
  modalData: {
    title: '*退出加盟后，您将与兔波波解除合作关系！',
    notice: 'a<br />a \n a\n',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
