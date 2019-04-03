import React, { Component } from 'react';
import { Layout, Input, Icon } from 'antd';
import { browserHistory } from 'react-router';
import WrappedNormalLoginForm from './NormalLoginForm';
import './style.scss';

const { Content } = Layout;

class View extends Component {
  onchange() {
    this.props.onChange();
  }
  login(values) {
    this.props.login(values).then((isSuccess) => {
      if (isSuccess) {
        browserHistory.push('/Manage');
      }
    });
  }
  createFormItem(opts) {
    const rules = [];
    if (opts.require) {
      rules.push({ required: true, message: `请输入${opts.label}` });
    }
    if (opts.max) {
      rules.push({ max: opts.max, message: `${opts.label}必须小于等于${opts.max}位` });
    }
    if (opts.min) {
      rules.push({ min: opts.min, message: `${opts.label}必须大于等于${opts.min}位` });
    }
    if (opts.pattern) {
      rules.push({ pattern: opts.pattern, message: opts.patternMsg });
    }
    return opts.getFieldDecorator(opts.name, {
      rules,
    })(
      <Input
        prefix={
          <Icon
            type={opts.icon}
            style={{ fontSize: 16 }}
          />
        }
        type={opts.type}
        placeholder={opts.label}
        autoComplete={opts.autoComplete}
        onChange={this.onchange.bind(this)}
      />
    );
  }


  render() {
    const {
      visible = true,
      data,
    } = this.props;
    return (
      <Layout className="login-layout">
        <Content
          className="loginFormStyle"
        >
          <div className="qrcode">
            <img
              src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/logincode.png"
              alt="扫描下载兔波波安卓版"
            />
            <p>扫描下载兔波波安卓版</p>
          </div>
          <div className="login-form-style">
            <WrappedNormalLoginForm
              login={this.login.bind(this)}
              loading={this.props.loading}
              errorNote={this.props.errorNote}
              createFormItem={this.createFormItem.bind(this)}
              changeRecord={this.props.changeRecord}
              data={data}
              visible={visible}
              sendNote={this.props.sendNote}
              changeVisible={this.props.changeVisible}
              find={this.props.find}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default View;
