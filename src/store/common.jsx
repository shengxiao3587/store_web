import { message, notification } from 'antd';
import React from 'react';
import { browserHistory } from 'react-router';
import fetch from '../util/fetch';
import { createAction } from '../util';
import '../util/fix';

const CryptoJS = require('../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
export const MENU_REQUEST = 'MENU_REQUEST';
export const MENU_SUCCESS = 'MENU_SUCCESS';
export const MENU_FAILURE = 'MENU_FAILURE';
export const SHOW_EDITPWD = 'SHOW_EDITPWD';
export const HIDE_EDITPWD = 'HIDE_EDITPWD';
export const SAVE_PWD_REQUEST = 'SAVE_PWD_REQUEST';
export const SAVE_PWD_SUCCESS = 'SAVE_PWD_SUCCESS';
export const SAVE_PWD_FAILURE = 'SAVE_PWD_FAILURE';
export const CLICK_TOP_MENU = 'CLICK_TOP_MENU';
export const CLICK_SUB_MENU = 'CLICK_SUB_MENU';
export const CLICK_MENU_ITEM = 'CLICK_MENU_ITEM';
export const INIT_MENU = 'INIT_MENU';
export const INIT_COMMON = 'INIT_COMMON';

const SEARCHSTORESTATUS_REQUEST = 'SEARCHSTORESTATUS_REQUEST';
const SEARCHSTORESTATUS_SUCCESS = 'SEARCHSTORESTATUS_SUCCESS';
const SEARCHSTORESTATUS_FAILURE = 'SEARCHSTORESTATUS_FAILURE';


// ------------------------------------
// Actions
// ------------------------------------
const key = CryptoJS.enc.Latin1.parse('dGJiZXhwcmVzcw==');
const iv = CryptoJS.enc.Latin1.parse('fxlyyqiuwwljqwss');

export const common = {
  // 门店营业或停业查询
  searchStoreStatus: () => ({
    types: [SEARCHSTORESTATUS_REQUEST, SEARCHSTORESTATUS_SUCCESS, SEARCHSTORESTATUS_FAILURE],
    callAPI: () => fetch('/storeManage/operateSetting/query'),
  }),
  loadMenu: () => ({
    types: [MENU_REQUEST, MENU_SUCCESS, MENU_FAILURE],
    // callAPI: () => fetch(`//${location.host}/mock/menu.json`, {}, {
    //   method: 'GET',
    // }),
    callAPI: () => fetch('/storeManage/menu/list', {}),
    callback: (payload, dispatch, state) => {
      // if forward to '/Manage', redirect to first link url according with the menu data
      if (location.pathname === '/Manage') {
        const matchs = JSON.stringify(state.common.menus).match(/"href":"([^"]*)"/) || [];
        const entryProcess = JSON.parse(localStorage.getItem('entryProcess'));
        if (entryProcess) {
          if (matchs[1]) {
            const firstLink = matchs[1];
            firstLink && browserHistory.replace(firstLink);
          }
        } else {
          browserHistory.replace('/Manage/ProtocolSteps');
        }
      }
      // select the menu
      dispatch(common.initMenu());
    },
  }),
  clickTopMenu: (id) => // when click top menu, find the first link under it
    (dispatch, getState) => {
      const menus = getState().common.menus;
      const topMenu = menus.find((menu) => menu.id === id);
      const findLink = (ms) => {
        for (let i = 0; i < ms.length; i += 1) {
          const menu = ms[i];
          if (menu.children) {
            return findLink(menu.children);
          } else if (menu.href) {
            return menu;
          }
        }
        return false;
      };

      const firstLeafMenu = findLink(topMenu.children);
      browserHistory.push(firstLeafMenu.href);
      // dispatch(common.initMenu())
    },
  clickMenuItem: createAction(CLICK_MENU_ITEM, 'payload'),
  clickSubMenu: createAction(CLICK_SUB_MENU, 'payload'),
  initMenu: createAction(INIT_MENU),
  initCommon: createAction(INIT_COMMON),
  showEditPwd: createAction(SHOW_EDITPWD),
  hideEditPwd: createAction(HIDE_EDITPWD),
  savePwd: (params) => {
    const newParams = params;
    const oldPwd = CryptoJS.AES.encrypt(
      newParams.oldPwd || '12345678',
      key,
      {
        iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      });
    const newPwd = CryptoJS.AES.encrypt(
      newParams.newPwd,
      key,
      {
        iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      });
    newParams.oldPwd = oldPwd.toString();
    newParams.newPwd = newPwd.toString();
    delete newParams.pwdConfirm;
    return {
      types: [SAVE_PWD_REQUEST, SAVE_PWD_SUCCESS, SAVE_PWD_FAILURE],
      callAPI: () => fetch('/user/update/password', newParams),
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [SEARCHSTORESTATUS_REQUEST]    : (state) => ({
    ...state,
  }),
  [SEARCHSTORESTATUS_SUCCESS]    : (state, action) => {
    localStorage.setItem('isRunFlag', action.data.operation);
    return {
      ...state,
    };
  },
  [SEARCHSTORESTATUS_FAILURE]    : (state) => ({
    ...state,
  }),
  [MENU_REQUEST]: (state) => ({
    ...state,
  }),
  [MENU_SUCCESS]: (state, action) => ({
    ...state,
    menus: action.data,
  }),
  [MENU_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [CLICK_TOP_MENU]: (state, action) => {
    const selectedTopKeys = [action.payload];

    return {
      ...state,
      selectedTopKeys,
    };
  },
  [CLICK_SUB_MENU]: (state, action) => {
    // toggle the sideSubMenu, not the leaf
    const index = state.openedKeys.indexOf(action.payload);
    index > -1 ? state.openedKeys.splice(index, 1) : state.openedKeys.push(action.payload);
    localStorage.setItem('menuKeys', JSON.stringify([state.selectedTopKeys, state.openedKeys, state.selectedKeys]));
    return {
      ...state,
      openedKeys: state.openedKeys,
    };
  },
  [CLICK_MENU_ITEM]: (state, action) => {
    const selectedKeys = [action.payload];
    // anyway, we should keep it persistent,
    // so we can get it previous state if some router not match the menu like detail page
    localStorage.setItem('menuKeys', JSON.stringify([state.selectedTopKeys, state.openedKeys, selectedKeys]));
    return {
      ...state,
      selectedKeys,
    };
  },
  [INIT_MENU]: (state) => {
    const menuKeys = [];

    // recursion to find the matched menu and its parentIds
    const findMenu = (menus) => {
      let res = false;
      for (let i = 0; i < menus.length; i += 1) {
        const menu = menus[i];
        menuKeys.push(menu.id);
        if (menu.href === location.pathname) {
          return true;
        } else if (menu.children) {
          res = findMenu(menu.children);
          if (!res) {
            menuKeys.pop();
          } else {
            return true;
          }
        } else {
          menuKeys.pop();
        }
      }
      return res;
    };

    findMenu(state.menus);

    let selectedTopKeys = [];
    let openedKeys = [];
    let selectedKeys = [];
    if (menuKeys.length === 0) { // if not matched, get the menu state from storage
      [selectedTopKeys, openedKeys, selectedKeys] =
        [...(JSON.parse(localStorage.getItem('menuKeys')) || [[], [], []])];
      if (!selectedKeys[0] && typeof selectedKeys[0] !== 'undefined' && selectedKeys[0] !== 0) {
        selectedKeys = ['11'];
      }
    } else {
      selectedTopKeys = [menuKeys.shift()];
      selectedKeys = [menuKeys.pop()];
      openedKeys = menuKeys;

      if (typeof selectedKeys[0] === 'undefined') {
        selectedKeys = ['11'];
      }
    }
    openedKeys = Array.from(new Set(openedKeys.concat(state.openedKeys))); // combine the submenu open state
    localStorage.setItem('menuKeys', JSON.stringify([selectedTopKeys, menuKeys, selectedKeys]));

    return {
      ...state,
      // these key state is persistent, so we should save them to store
      selectedTopKeys,
      openedKeys,
      selectedKeys,
    };
  },
  [INIT_COMMON]: (state) => { // not usable
    const resetPassword = JSON.parse(localStorage.getItem('resetPassword'));

    // detect browser version
    const userAgent = (navigator.userAgent.match(/Chrome\/(\d+)\./) || [])[1] || 0;
    userAgent && (+userAgent < 54) && notification.warning({
      duration: null,
      message: '浏览器版本过低',
      description: <div>请下载<a href="http://www.chromeliulanqi.com/Chrome_Latest_Setup.exe">最新版chrome浏览器</a></div>,
    });
    return {
      ...state,
      editPwdVisible: (typeof resetPassword === 'boolean' && !resetPassword) || false,
    };
  },
  [SHOW_EDITPWD]: (state) => ({
    ...state,
    editPwdVisible: true,
  }),
  [HIDE_EDITPWD]: (state) => ({
    ...state,
    editPwdVisible: false,
  }),
  [SAVE_PWD_REQUEST]: (state) => ({
    ...state,
    savePwdLoading: true,
  }),
  [SAVE_PWD_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      savePwdLoading: false,
      editPwdVisible: false,
    };
  },
  [SAVE_PWD_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      savePwdLoading: false,
    };
  },
};

const resetPassword = JSON.parse(localStorage.getItem('resetPassword'));

const initialState = {
  menus: [],
  editPwdVisible: typeof resetPassword === 'boolean' && !resetPassword,
  savePwdLoading: false,
  permission: {},
  selectedKeys: [],
  openedKeys: [],
  selectedTopKeys: [],
};
export default function commonReducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
