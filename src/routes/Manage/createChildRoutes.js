/* eslint-disable import/no-dynamic-require */
import { browserHistory } from 'react-router';
import { common } from '../../store/common';
import { injectReducer } from '../../store/reducers';

export default (moduleName, id) => {
  let path = moduleName;
  if (id) {
    path += `/:${id}`;
  }
  return (store) => ({
    path,
    onEnter: (opts, replace, next) => {
      if (moduleName !== 'ProtocolSteps' && localStorage.getItem('entryProcess') === 'false') {
        browserHistory.push('/Manage/ProtocolSteps');
      }
      store.dispatch(common.initMenu());
      next();
    },
    onLeave: () => {
      if (localStorage.getItem('entryProcess') === 'false') {
        history.go(0);
      }
    },
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const container = require(`./${moduleName}/containers/index`).default;
        const reducer = require(`./${moduleName}/modules/index`).default;
        injectReducer(store, { key: moduleName, reducer });
        cb(null, container);
      });
    },
  });
};
