import React, { Component } from 'react';
import { Icon } from 'antd';
import { browserHistory } from 'react-router';
import './walletout.scss';
import ForgetSecret from '../../Wallet/components/ForgetSecret';
import DetailPage from '../../../../components/DetailPage';

class View extends Component {
  componentDidMount() {
    this.props.detail().then((resultData) => {
      resultData.success && this.props.getPhone();
    });
  }
  onCodeClick() {
    const { props } = this;
    return new Promise(((resolve) => {
      if (props.getStorePhone) {
        props.sendNote({
          phone: props.getStorePhone,
          source: 1,
        });
        resolve(true);
      } else {
        resolve(false);
      }
    }));
  }
  handleSave(form) {
    const { props } = this;
    form.validateFields(['money', 'authCode', 'password'], (err, values) => {
      if (!err) {
        props.save(values).then((isSuccess) => {
          isSuccess.success && browserHistory.push('/Manage/Wallet');
        });
      }
    });
  }

  render() {
    const {
      record,
      loading,
      bindbankData,
      getStorePhone,
      bankPicTypeData,
      errorExplain,
      visibleData,
    } = this.props;
    const hint = (
      <div>
        <span>请输入6位数字兔波波支付密码 </span>
        <a role="button" tabIndex={-41} onClick={this.props.onShowModal} style={{ color: '#1D61F0' }}> 忘记密码</a>
      </div>
    );
    const fields = [
      {
        label: '提现金额',
        name: 'money',
        formHalf: true,
        required: true,
        twodecimal: true,
        className: 'takeout',
        extra:`可用余额￥${bindbankData.money}`,
        validator: (rule, value, callback) => {
          if (parseFloat(value, 10) < 100) {
            callback('单笔提现金额最低为100元');
          }
          if (parseFloat(value, 10) <= bindbankData.money) {
            callback();
          } else {
            callback('输入的数字不能大于余额');
          }
        },
      },
      {
        label: (<div> <Icon type="line" /> <span>为了保证账户资金的安全性，需短信校验</span></div>),
        name: 'title2',
        type: 'title',
        className: 'detailPage',
      },
      {
        label: '手机号',
        name: 'phone',
        formHalf: true,
        disabled: true,
      },
      {
        label: '验证码',
        name: 'authCode',
        formHalf: true,
        required: true,
        onClick: this.onCodeClick.bind(this),
        type: 'captcha',
        icon: 'lock',
        max: 6,
      },
      {
        label: '兔波波支付密码',
        name: 'password',
        formHalf: true,
        required: true,
        type: 'password',
        extra: hint,
        validator: (rule, value, callback) => {
          const flag = value && /^\d+$/.test(value);
          if (flag && value.length === 6) {
            callback();
          } else if ((value && value.length !== 6) || !flag) {
            callback('请设置6位数字密码');
          }
        },
      },
    ];
    const buttons = [{
      label: '确认提现',
      onClick: this.handleSave.bind(this),
      loading,
    }];
    const bankTitle = (<div className="Wallet_bankStyle">
      <img src={bankPicTypeData[bindbankData.bank]} alt="2" />
      <span className="Wallet_bankStyle_bankNum">
        {bindbankData.bankNum.replace(/\d{1,}(\d{4})/, '**** **** **** $1')}
      </span>
      <span className="Wallet_bankStyle_bankType"> {bindbankData.bankType} </span>
    </div>);
    return (
      <div className="ant-content-inner walletOut">
        <h2 className="title">我的钱包 | 余额提现</h2>
        <div className="balance">
          <div>
            <span className="money">我的余额：</span>
            <span className="icon">￥</span>
            <span className="value">{ bindbankData.money }</span>
          </div>
        </div>
        <div className="detail">
          <DetailPage
            title={bankTitle}
            fields={fields}
            values={record}
            loading={loading}
            buttons={buttons}
            changeRecord={this.props.changeRecord}
            buttonCenter
          />
        </div>
        <div className="warmTitle">
          <p>温馨提示</p>
          <p>1.单笔提现金额最低为100元，每笔收取2元手续费。每天只可提现一次。</p>
          <p>2.预计1-5个工作日到账。</p>
        </div>
        <ForgetSecret
          {...this.props}
          visibleData={visibleData}
          record={record}
          errorExplain={errorExplain}
          getStorePhone={getStorePhone}
        />
      </div>
    );
  }
}

export default View;
