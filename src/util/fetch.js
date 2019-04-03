import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import { getBaseUrl } from '../util';


const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  const res = {};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = params[key];
    let value = param && typeof param === 'object' && // fields is a object perhaps
    !(param instanceof Array) && // not array
    !(param._d) // not moment
      ? (((param.value && param.value.trim) && param.value.trim()) || param.value) : param;

    if (value instanceof Array && value.length === 2) { // dateRange, datetimeRange, numberRange
      if (param.type === 'datetimeRange' || param.type === 'numberRange') {
        res[`${key}Start`] = value[0] || undefined;
        res[`${key}End`] = value[1] || undefined;
      } else if (param.type === 'dateRange' || param.type === 'twodateRange') {
        res[`${key}Start`] = value[0] && value[0].format('YYYY-MM-DD 00:00:00');
        res[`${key}End`] = value[1] && value[1].format('YYYY-MM-DD 23:59:59');
      } else {
        res[key] = value;
      }
    } else {
      if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(value)) { // fix time string to second
        value += ':00';
      }
      res[key] = typeof value === 'undefined' ? '' : (((value && value.trim) && value.trim()) || value);
    }
  }
  return res;
};

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `store${localStorage.getItem('accessToken')}`,
    },
  };
  const newOpts = {
    ...defaultOpts,
    ...opts,
  };

  if (newOpts.method === 'POST') {
    newOpts.body = JSON.stringify(decorateParams(params));
  }
  document.querySelector('#overlay').style.display = 'block';
  const urlCache = url.indexOf('//') > -1 ? url : (getBaseUrl() + url);
  return fetch(urlCache, newOpts)
    .then((res) => {
      document.querySelector('#overlay').style.display = 'none';
      if (res.status < 200 || res.status >= 300) {
        return {
          resultCode: '-1',
          resultDesc: `${res.status} ${res.statusText}`,
        };
      }
      const contentType = res.headers.get('content-type');
      if (contentType.indexOf('application/json') > -1) {
        return res.json();
      }
      return res.blob();
    })
    .then((json) => {
      if (json.type) { // blob
        return json;
      }
      return new Promise((resolve) => {
        if (json.resultCode === '11' || json.resultCode === '12' || json.resultCode === '13') { // token错误，不存在
          localStorage.setItem('accessToken', '');
          localStorage.setItem('user', '{}');
          location.assign('/SignIn');
        }
        if (json.resultCode === '10') {
          const paramsTemp = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          if (newOpts.method === 'POST') {
            paramsTemp.body = JSON.stringify(decorateParams({ refreshToken : localStorage.getItem('refreshToken') }));
          }
          fetch((`${getBaseUrl()}/user/refreshToken`), paramsTemp)
            .then((res) => {
              if (res.status < 200 || res.status >= 300) {
                return {
                  resultCode: '-1',
                  resultDesc: `${res.status} ${res.statusText}`,
                };
              }
              return res.json();
            }).then((jsonone) => {
              if (jsonone.resultCode === '10' || jsonone.resultCode === '11' ||
                jsonone.resultCode === '12' || jsonone.resultCode === '13') { // 登录过期或未登录
                localStorage.setItem('accessToken', '');
                localStorage.setItem('user', '{}');
                location.assign('/SignIn');
                browserHistory.push('/SignIn');
              }
              const { resultData } = jsonone;

              localStorage.setItem('accessToken', resultData.token);
              localStorage.setItem('refreshToken', resultData.refreshToken);

              const resetUrl = getBaseUrl() + url;

              document.querySelector('#overlay').style.display = 'block';
              newOpts.headers.Authorization = resultData.token;
              fetch(resetUrl, newOpts).then((res) => {
                document.querySelector('#overlay').style.display = 'none';
                if (res.status < 200 || res.status >= 300) {
                  return {
                    resultCode: '-1',
                    resultDesc: `${res.status} ${res.statusText}`,
                  };
                }
                const contentType = res.headers.get('content-type');
                if (contentType.indexOf('application/json') > -1) {
                  return res.json();
                }
                return res.blob();
              }).then((jsontwo) => {
                resolve(jsontwo);
              });
            });
        } else {
          resolve(json);
        }
      });
    })
    .catch(() => {
      document.querySelector('#overlay').style.display = 'none';
      return {
        resultCode: '-1',
        resultDesc: '网络异常，请重试',
      };
    });
};
