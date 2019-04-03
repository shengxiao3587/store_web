import React, { Component } from 'react';
import { Form, Button, Modal, message } from 'antd';
import './style.scss';
import DetailPage from '../../../components/DetailPage';

const FormItem = Form.Item;

class WrappedNormalLoginForm extends Component {
  handleCodeClick() {
    const data = this.props.data;
    return new Promise(((resolve) => {
      if (data.phone && /^1[345678][0-9]{9}$/.test(data.phone.value)) {
        // 发送短信
        this.props.sendNote({
          phone: data.phone.value,
          type: 'f',
        });
        resolve(true);
      } else {
        message.error('请输入手机号');
        resolve(false);
      }
    }));
  }
  warn() {
    this.props.changeVisible({
      visible: true,
    });
  }
  handleCancel() {
    this.props.changeVisible({
      visible: false,
    });
  }
  save(form) {
    form.validateFieldsAndScroll({ force: true }, (err, paramsTemp) => {
      if (!err) {
        this.props.find(paramsTemp);
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      errorNote,
      createFormItem,
      visible,
      data,
    } = this.props;
    const modalButtons = [{
      label: '提交',
      onClick: this.save.bind(this),
      type: 'default',
    }];
    const fields = [{
      label: '账号',
      name: 'phone',
      required: true,
      simple: true,
      phone: true,
    }, {
      label: '验证码',
      name: 'code',
      required: true,
      simple: true,
      type: 'captcha',
      icon: 'lock',
      onClick: this.handleCodeClick.bind(this),
      className: 'captchaBtn',
    }, {
      label: '新密码',
      name: 'newPassword',
      simple: true,
      required: true,
      type: 'password',
      long: true,
      validator: (rule, value, callback) => {
        const pwdConfirm = (data && data.pwdConfirm) || { value: '' };
        if (!(/^[0-9a-zA-Z]{8,20}$/.test(value))) {
          callback('密码为8-20位数字或字母');
        }
        if (pwdConfirm.value && value && value !== pwdConfirm.value) {
          callback('两次密码输入不一致');
        }
        callback();
      },
    }, {
      label: '新密码',
      name: 'pwdConfirm',
      simple: true,
      long: true,
      type: 'password',
      required: true,
      validator: (rule, value, callback) => {
        const newPwd = (data && data.newPassword) || { value: '' };
        if (value && value !== newPwd.value) {
          callback('两次密码输入不一致');
        } else {
          callback();
        }
      },
    }];
    return (
      <div>
        <Modal
          width="800px"
          visible={visible}
          footer={null}
          onCancel={this.handleCancel.bind(this)}
          title="忘记密码"
          className="nameListModal"
        >
          <DetailPage
            fields={fields}
            buttons={modalButtons}
            changeRecord={this.props.changeRecord}
            values={data}
          />
        </Modal>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <div className="login-logo-wrapper">
            <div className="login-logo-text">兔波波门店工作台</div>
          </div>
          <div className="login-errorNote">{ errorNote }</div>
          <FormItem>
            {createFormItem({
              getFieldDecorator,
              require: true,
              icon: 'user',
              type: 'text',
              label: '账号',
              name: 'phone',
              autoComplete: 'off',
            })}
          </FormItem>
          <FormItem>
            {createFormItem({
              getFieldDecorator,
              require: true,
              icon: 'lock',
              type: 'password',
              label: '密码',
              name: 'password',
              autoComplete: 'off',
            })}
          </FormItem>
          <FormItem>
            <div className="login-fp">
              <a role="button" tabIndex={0} onClick={this.warn.bind(this)}>忘记密码</a>
            </div>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.loading}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const NormalLoginForm = Form.create()(WrappedNormalLoginForm);

export default NormalLoginForm;
