import { message } from 'antd';
import fetch from '../../../util/fetch';
import { createAction } from '../../../util';

const CryptoJS = require('../../../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const LOGIN_ONCHANGE = 'LOGIN_ONCHANGE';
const LOGIN_CHANGERECORD = 'LOGIN_CHANGERECORD';
const LOGIN_SENDNOTE_SUCCESS = 'LOGIN_SENDNOTE_SUCCESS';
const LOGIN_SENDNOTE_FAILURE = 'LOGIN_SENDNOTE_FAILURE';
const LOGIN_SENDNOTE_REQUEST = 'LOGIN_SENDNOTE_REQUEST';
const LOGIN_CHANGEVISIBLE = 'LOGIN_CHANGEVISIBLE';
const LOGIN_FIND_SUCCESS = 'LOGIN_FIND_SUCCESS';
const LOGIN_FIND_REQUEST = 'LOGIN_FIND_REQUEST';
const LOGIN_FIND_FAILURE = 'LOGIN_FIND_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
const key = CryptoJS.enc.Latin1.parse('dGJiZXhwcmVzcw==');
const iv = CryptoJS.enc.Latin1.parse('fxlyyqiuwwljqwss');

const loginRequest = (params) => ({
  type: LOGIN_REQUEST,
  payload: params,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

const loginFailure = (msg) => ({
  type: LOGIN_FAILURE,
  payload: msg,
});

const changeRecord = (params) => ({
  type: LOGIN_CHANGERECORD,
  payload: params,
});
const sendNoteSuccess = (params) => ({
  type: LOGIN_SENDNOTE_SUCCESS,
  payload: params,
});
const sendNoteRequest = (params) => ({
  type: LOGIN_SENDNOTE_REQUEST,
  payload: params,
});
const sendNotefailure = (msg) => ({
  type: LOGIN_SENDNOTE_FAILURE,
  payload: msg,
});
const changeVisible = (params) => ({
  type: LOGIN_CHANGEVISIBLE,
  payload: params,
});
const findSuccess = (params) => ({
  type: LOGIN_FIND_SUCCESS,
  payload: params,
});
const findRequest = (params) => ({
  type: LOGIN_FIND_REQUEST,
  payload: params,
});
const findfailure = (msg) => ({
  type: LOGIN_FIND_FAILURE,
  payload: msg,
});
const find = (params) => (dispatch) => {
  dispatch(findRequest(params));
  const encrypted = CryptoJS.AES.encrypt(
    params.newPassword,
    key,
    {
      iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
    });
  return fetch('/user/find/password', {
    ...params,
    password: encrypted.toString(),
  })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(findSuccess(json.resultData));
        return true;
      }
      dispatch(findfailure(json.resultDesc));
      return false;
    });
};
const sendNote = (params) => (dispatch) => {
  dispatch(sendNoteRequest(params));
  return fetch('/validateCode/send', {
    ...params,
  })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(sendNoteSuccess(json.resultData));
        return true;
      }
      dispatch(sendNotefailure(json.resultDesc));
      return false;
    });
};

const login = (params) => (dispatch) => {
  dispatch(loginRequest(params));
  const encrypted = CryptoJS.AES.encrypt(
    params.password,
    key,
    {
      iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
    });
  return fetch('/user/login', {
    ...params,
    password: encrypted.toString(),
  })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(loginSuccess(json.resultData));
        return true;
      }
      dispatch(loginFailure(json));
      return false;
    });
};

export const actions = {
  login,
  find,
  changeRecord,
  sendNote,
  changeVisible,
  onChange: createAction(LOGIN_ONCHANGE),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_FIND_REQUEST]: (state) => ({
    ...state,
  }),
  [LOGIN_FIND_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      visible: false,
    };
  },
  [LOGIN_FIND_FAILURE]: (state, action) => {
    message.error(action.payload);
    return {
      ...state,
    };
  },
  [LOGIN_CHANGEVISIBLE]: (state, action) => ({
    ...state,
    ...action.payload,
    data: {},
  }),
  [LOGIN_SENDNOTE_REQUEST]: (state) => ({
    ...state,
  }),
  [LOGIN_SENDNOTE_SUCCESS]: (state) => ({
    ...state,
  }),
  [LOGIN_SENDNOTE_FAILURE]: (state, action) => {
    message.error(action.payload);
    return {
      ...state,
    };
  },
  [LOGIN_CHANGERECORD]: (state, action) => ({
    ...state,
    data: {
      ...action.payload,
    },
  }),
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    username: action.payload.username,
    password: action.payload.password,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    localStorage.setItem('accessToken', action.payload.token);
    localStorage.setItem('refreshToken', action.payload.refreshToken);
    localStorage.setItem('name', JSON.stringify(action.payload.name));
    localStorage.setItem('storeName', JSON.stringify(action.payload.storeName));
    localStorage.setItem('roleType', action.payload.roleType);
    localStorage.setItem('entryProcess', action.payload.entryProcess);
    localStorage.setItem('resetPassword', action.payload.resetPassword);
    localStorage.setItem('count', 0);
    return {
      ...state,
      user: action.payload.user,
      loading: false,
      errorNote: '',
    };
  },
  [LOGIN_FAILURE]: (state, action) => {
    const { payload } = action;
    let errorNote;
    if (payload.resultCode === '2') {
      errorNote = '用户名错误';
    } else if (payload.resultCode === '20') {
      errorNote = payload.resultDesc;
    } else {
      errorNote = payload.resultDesc;
    }
    localStorage.setItem('accessToken', '');
    return {
      ...state,
      user: '',
      loading: false,
      errorNote,
    };
  },
  [LOGIN_ONCHANGE]: (state) => ({
    ...state,
    errorNote: '',
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  errorNote: '',
  detail: true,
  username: '',
  password: '',
  user: '',
  loading: false,
  data: {},
  visible: false,
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
