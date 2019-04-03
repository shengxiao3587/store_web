/**
 * Created by xiaolb on 2018/1/3.
 */
import React, { Component } from 'react';
import ModalForm from '../../../../components/ModalForm';

export default class Unbindbank extends Component {
  // 点击忘记密码的时候获取手机号
  getPhone() {
    this.props.getPhone().then(() => {
      this.props.onShowModal('forget');
    });
  }
  save() {
    const {
      record,
      unBindBank,
      search,
    } = this.props;
    // 解绑
    unBindBank(record).then((isSuccess) => {
      isSuccess && search();
    });
  }
  render() {
    const {
      visibleData,
      record,
      errorExplain,
    } = this.props;

    const hint = (
      <div>
        <span>请输入6位数字兔波波支付密码 </span>
        <a role="button" tabIndex={-41} onClick={this.getPhone.bind(this)} style={{ color: '#1D61F0' }}> 忘记密码</a>
      </div>
    );
    // 绑定银行卡
    const UnBindBankfields = [
      {
        type: 'title',
        label: <span>{ errorExplain }</span>,
        key:'explain',
        className: 'newsError',
        hidden: !errorExplain,
      },
      {
        type: 'title',
        key:'takeout',
        label: <span>为了保证账户资金的安全性，需输入兔波波支付密码才能解绑银行卡。</span>,
        className: 'newsBackgroundColorInsert',
      },
      {
        label: '兔波波支付密码',
        name: 'password',
        simple: true,
        required: true,
        long: true,
        validator: (rule, value, callback) => {
          const flag = value && /^\d+$/.test(value);
          if (flag && value.length === 6) {
            callback();
          } else if ((value && value.length !== 6) || !flag) {
            callback('请设置6位数字密码');
          }
        },
        extra: hint,
      },
    ];
    return (
      <ModalForm
        {...this.props}
        visible={visibleData.visibleUnBank}
        fields={UnBindBankfields}
        formWidth={800}
        cusTitle="解除绑定后，不能提现"
        onCreate={this.save.bind(this)}
        values={record}
      />
    );
  }
}
