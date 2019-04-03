import { message } from 'antd';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const HOMEPAGE_SEARCH_REQUEST = 'HOMEPAGE_SEARCH_REQUEST';
const HOMEPAGE_SEARCH_SUCCESS = 'HOMEPAGE_SEARCH_SUCCESS';
const HOMEPAGE_SEARCH_FAILURE = 'HOMEPAGE_SEARCH_FAILURE';
const HOMEPAGE_SELECT = 'HOMEPAGE_SELECT';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  search: () => ({
    types: [HOMEPAGE_SEARCH_REQUEST, HOMEPAGE_SEARCH_SUCCESS, HOMEPAGE_SEARCH_FAILURE],
    callAPI: () => fetch('/storeManage/express/count'),
  }),
  changeSelect: createAction(HOMEPAGE_SELECT, 'value'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [HOMEPAGE_SEARCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [HOMEPAGE_SEARCH_SUCCESS]: (state, action) => {
    const {
      recentlyMonthInList,
      recentlyMonthSignList,
      todayIn = 0,
      signRate = '0%',
      totalExists = 0,
      todaySign = 0,
      pendThing,
    } = action.data;
    return {
      ...state,
      recentlyMonthInList,
      recentlyMonthSignList,
      loading: false,
      InitData: {
        signRate,
        todayIn,
        todaySign,
        totalExists,
      },
      allData: {
        ...state.allData,
        recentlyMonthInList: recentlyMonthInList.slice(-7),
        recentlyMonthSignList: recentlyMonthSignList.slice(-7),
        dealWithData: pendThing || [],
      },
    };
  },
  [HOMEPAGE_SEARCH_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [HOMEPAGE_SELECT]    : (state, action) => {
    localStorage.setItem('count', 0);
    return {
      ...state,
      loading: false,
      allData: {
        ...state.allData,
        recentlyMonthInList: state.recentlyMonthInList.slice(-action.value),
        recentlyMonthSignList: state.recentlyMonthSignList.slice(-action.value),
      },
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: true,
  // 代办事项处理
  dealWithData: [],
  InitData: {
    todayIn: 0,
    signRate: '0%',
    todaySign: 0,
    totalExists: 0,
  },
  allData:{
    recentlyMonthInList: [],
    recentlyMonthSignList: [],
    width: 800,
    height: 300,
    forceFit: true,
    plotCfg: {
      margin: [30, 40, 100, 80],
    },
  },
  recentlyMonthInList: [],
  recentlyMonthSignList: [],
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
