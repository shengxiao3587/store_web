import { combineReducers } from 'redux';
import locationReducer from './location';
import commonReducer from './common';
import dictReducer from './dict';

const makeRootReducer = (asyncReducers) =>
  // 合并
  combineReducers({
    // locationreducer 返回变化后的路径地址
    location: locationReducer,
    common: commonReducer,
    dict: dictReducer,
    ...asyncReducers,
  });


export const injectReducer = (store, { key, reducer }) => {
  const newStore = store;
  if (Object.hasOwnProperty.call(newStore.asyncReducers, key)) return;

  newStore.asyncReducers[key] = reducer;
  newStore.replaceReducer(makeRootReducer(newStore.asyncReducers));
};

export default makeRootReducer;
