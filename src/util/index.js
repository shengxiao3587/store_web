import config from '../config.json';

export const getFieldsValue = (fields = {}) => {
  const res = {};
  const keys = Object.keys(fields || {});
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = fields[key];
    res[key] = typeof param === 'object' && !(param instanceof Array) ? param.value : param;
  }
  return res;
};

export const getSessionValue = (key) => JSON.parse(localStorage.getItem('user'))[key];

/*
* get url prefix according to the env, default development
* */
export const getNodeEnv = () => {
  let env = 'development';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__DEVELOPMENT__) {
    env = 'development';
  }
  return env;
};

export const getPayUrl = () => {
  const payUrl = config.payUrl;
  return payUrl[getNodeEnv()];
};

export const getBaseUrl = () => {
  const address = config.apiAddress;
  if (__MOCK__) {
    return address.mock;
  }
  return address[getNodeEnv()];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function dislodge(arr1, arr2) {
  for (let i = 0, len = arr2.length; i < len; i += 1) {
    const index = arr1.indexOf(arr2[i]);
    if (index >= 0) {
      arr1.splice(index, 1);
    }
  }
  return arr1;
}

export function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}

// 获取url中"?"符后的值
export function getRequest() {
  const url = location.search; // 获取url中"?"符后的字串
  const theRequest = {};
  if (url.indexOf('?') !== -1) {
    const str = url.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i += 1) {
      theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
    }
  }
  return theRequest;
}
