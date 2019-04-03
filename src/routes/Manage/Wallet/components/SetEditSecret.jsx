/**
 * Created by xiaolb on 2017/12/14.
 */
import React, { Component } from 'react';
import ModalForm from '../../../../components/ModalForm';

export default class SetEditSecret extends Component {
  save() {
    this.props.setEditSave(this.props.record).then((isSuccess) => {
      isSuccess && this.props.search();
    });
  }
  render() {
    const {
      visibleData,
      record,
      errorExplain,
      walletData,
    } = this.props;
    // 设置或编辑支付密码
    const setEditFields = [
      {
        type: 'title',
        label: <span>{ errorExplain }</span>,
        key:'explain',
        className: 'warning',
        hidden: !errorExplain,
      }, {
        labelExtra:'原密码',
        name: 'oldPassword',
        long: true,
        simple: true,
        type: 'password',
        hidden: !walletData.hasPassword,
        required: true,
        validator: (rule, value, callback) => {
          const flag = value && /^\d+$/.test(value);
          if (flag && value.length === 6) {
            callback();
          } else if ((value && value.length !== 6) || !flag) {
            callback('请设置6位数字密码');
          }
        },
      }, {
        labelExtra:'新密码',
        name: 'newPassword',
        long: true,
        simple: true,
        type: 'password',
        required: true,
        validator: (rule, value, callback) => {
          const flag = value && /^\d+$/.test(value);
          if (flag && value.length === 6) {
            callback();
          } else if ((value && value.length !== 6) || !flag) {
            callback('请设置6位数字密码');
          }
        },
      }, {
        labelExtra:'新密码',
        name: 'pwdConfirm',
        long: true,
        simple: true,
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
        visible={visibleData.visibleSetEdit}
        fields={setEditFields}
        formWidth={600}
        cusTitle="设置兔波波支付密码"
        onCreate={this.save.bind(this)}
        values={record}
      />
    );
  }
}
