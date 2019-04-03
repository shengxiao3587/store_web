import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import { CountlyUtil, FunDebugUtil } from '@xinguang/common-tool';
import './util/fix';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import createRoutes from './routes';
import { getNodeEnv } from './util';
import config from './config.json';

// ========================================================
// 初始化的appKey在src/config.json中的countly处可找到
// ========================================================
const NODE_ENV = getNodeEnv();
const countlyAppKey = config.countly.appKey[NODE_ENV];
CountlyUtil.init(countlyAppKey, NODE_ENV);

// 接入fundebug
const name = localStorage.getItem('name') + localStorage.getItem('storeName');
FunDebugUtil.init(process.env.funDebugKey, NODE_ENV, process.env.version, name);

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const routes = createRoutes(store);
  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle
if (__DEVELOPMENT__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

// ========================================================
// Go!
// ========================================================
render();
