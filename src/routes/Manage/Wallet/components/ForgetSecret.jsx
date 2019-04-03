/**
 * Created by xiaolb on 2017/12/14.
 */
import React, { Component } from 'react';
import ModalForm from '../../../../components/ModalForm';

export default class ForgetSecret extends Component {
  // 点击发送短信按钮
  onCodeClick() {
    const { props } = this;
    // 发送短信组件还有后续操作，必须通过Promise返回一个值
    return new Promise(((resolve) => {
      if (props.getStorePhone) {
        // 发送短信
        props.sendNote({
          phone: props.getStorePhone,
          source: 0,
        });
        resolve(true);
      } else {
        resolve(false);
      }
    }));
  }
  save() {
    const { props } = this;
    props.forgetSave(props.record).then((isSuccess) => {
      isSuccess && props.search && props.search();
    });
  }
  render() {
    const {
      visibleData,
      record,
      errorExplain,
    } = this.props;
    // 忘记密码
    const forgetfields = [
      {
        type: 'title',
        label: <span>{ errorExplain }</span>,
        key:'explain',
        className: 'newsError',
        hidden: !errorExplain,
      }, {
        type: 'title',
        key:'takeout',
        label: <span>请填写真实有效的信息，以验证您的身份</span>,
        className: 'newsBackgroundColor',
      }, {
        label: '手机号',
        name: 'phone',
        simple: true,
        disabled: true,
      }, {
        label: '验证码',
        name: 'authCode',
        simple: true,
        required: true,
        long: true,
        onClick: this.onCodeClick.bind(this),
        type: 'captcha',
        icon: 'lock',
        max: 6,
        className: 'captchaBtn',
      }, {
        label: '登录密码',
        name: 'storePassword',
        simple: true,
        required: true,
        type: 'password',
        char:true,
        long: true,
        min: 8,
        max: 20,
      }, {
        type: 'title',
        key:'bindPhone',
        label: <span>请设置6位数字作为您的兔波波支付密码，建议不要与银行卡密码一致</span>,
        className: 'newsBackgroundColorInsert',
      }, {
        label: '设置密码',
        name: 'newPassword',
        simple: true,
        required: true,
        type: 'password',
        long: true,
        validator: (rule, value, callback) => {
          const flag = value && /^\d+$/.test(value);
          if (flag && value.length === 6) {
            callback();
          } else if ((value && value.length !== 6) || !flag) {
            callback('请设置6位数字密码');
          }
        },
      }, {
        label: '设置密码',
        name: 'pwdConfirm',
        simple: true,
        long: true,
        type: 'password',
        required: true,
        validator: (rule, value, callback) => {
          const newPwd = (record && record.newPassword) || { value: '' };
          if (value && value !== newPwd.value) {
            callback('两次密码输入不一致');
          } else {
            callback();
          }
        },
      },
    ];
    return (
      <ModalForm
        {...this.props}
        className="error_explain"
        visible={visibleData.visibleForget}
        fields={forgetfields}
        formWidth={800}
        cusTitle="忘记兔波波支付密码"
        onCreate={this.save.bind(this)}
        values={record}
      />
    );
  }
}

