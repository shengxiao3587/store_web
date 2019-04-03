import React, { Component } from 'react';
import { Form } from 'antd';
import { getRequest } from '../../../util';
import './errorpage.scss';

class WrappedNormalLoginForm extends Component {
  render() {
    let Request = {};
    Request = getRequest();
    let errorNews = '操作失败';
    const resultCode = decodeURIComponent(Request.resultCode);
    if (resultCode === '41') {
      errorNews = '时间错误';
    } else if (resultCode === '42') {
      errorNews = '导出的时间范围超过一个月';
    } else if (resultCode === '44') {
      errorNews = `导出的记录条数过多，试试分批导出,一次性最多可以导出${decodeURIComponent(Request.max)}条记录`;
    } else if (resultCode === '46') {
      errorNews = '批量导出数据为空';
    }
    return (
      <Form>
        <div className="login-logo-wrapper flex flex-c errorpagepic">
          <div>
            <img alt="" src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/network_error@3x.png" />
          </div>
        </div>
        <div className="errorpagefont">哎呦，出错啦~</div>
        <div className="errorpagetitle">具体原因是：{errorNews}</div>
      </Form>
    );
  }
}

const NormalLoginForm = Form.create()(WrappedNormalLoginForm);

export default NormalLoginForm;
