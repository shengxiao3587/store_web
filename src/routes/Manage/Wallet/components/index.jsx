import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Button, Tabs, message, Modal } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import Bindbank from './Bindbank';
import Unbindbank from './Unbindbank';
import SetEditSecret from './SetEditSecret';
import ForgetSecret from './ForgetSecret';
import './wallet.scss';

const TabPane = Tabs.TabPane;

class View extends Component {
  componentDidMount() {
    const { props } = this;
    // 获取银行的类型
    props.dict('bankType');
    props.dict('tradeType');
    props.dict('tradeStatus');
    // 获取我的钱包详情
    props.search().then((resultData) => {
      // 如果成功之后，判断是不是绑定了银行卡
      resultData.success && resultData.data.bankCardBinded && this.props.bankdetail();
    });
    // 获取交易流水列表
    props.paybillList({
      tradeTime: {
        value:[
          moment(),
          moment(),
        ],
        type: 'twodateRange',
      },
      pageSize: 10,
      pageNo: 1,
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  // 点击忘记密码的时候获取手机号
  getPhone() {
    this.props.getPhone().then(() => {
      this.props.onShowModal('forget');
    });
  }
  paybillList(params) {
    this.props.paybillList({
      ...params,
    });
  }
  // 解绑
  // unBindBank() {
  //   this.props.unBindBank().then(() => this.props.search());
  // }
  // 点击提现操作按钮
  takeOutClick() {
    const { props } = this;
    const {
      walletData,
    } = props;
    if (walletData.takeOutFlag) {
      message.warn('每天只能提现一次');
    } else if (!walletData.bankCardBinded) {
      // 绑定银行卡
      Modal.warning({
        title:<span style={{ fontSize: '18px' }}>绑定银行卡，才能提现</span>,
        okText: '立即绑定',
        cancelText: '',
        onOk: () => { props.onShowModal('bindBank'); },
      });
    } else if (!walletData.hasPassword) {
      // 设置兔波波支付密码
      Modal.warning({
        title:<span style={{ fontSize: '18px' }}>设置兔波波支付密码，才能提现</span>,
        okText: '立即设置',
        cancelText: '',
        onOk: () => { props.onShowModal('setEdit'); },
      });
    } else {
      browserHistory.push('/Manage/WalletOut');
    }
  }
  render() {
    const {
      data,
      page,
      errorExplain,
      record,
      walletData,
      visibleData,
      bindbankData,
      onShowModal,
      getStorePhone,
      bankPicTypeData,
      listLoading,
      searchParams,
      dicts,
      tradeRemarkList,
    } = this.props;
    // 记录流水
    const columns = [
      {
        label: '交易时间',
        name: 'tradeTime',
        required: true,
        render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
        search: true,
        type: 'twodateRange',
        validator: (rule, values, callback) => {
          if ((values.startValue || values[0]) && (values.endValue || values[1])) {
            callback();
          }
          if (!values.startValue && !values[0]) {
            callback('请输入开始时间');
          }
          if (!values.endValue && !values[1]) {
            callback('请输入结束时间');
          }
        },
      }, {
        label: '交易类型',
        name: 'tradeType',
        search: true,
        type: 'select',
        data: dicts.tradeType,
        onSelect: (value) => {
          this.props.tradeRemark({ tradeTypeId: value });
        },
      }, {
        label: '交易说明',
        name: 'tradeRemark',
        search: true,
        type: 'select',
        data: tradeRemarkList,
      }, {
        label: '交易金额',
        name: 'tradeMoney',
      }, {
        label: '交易状态',
        name: 'tradeStatus',
        type: 'select',
        search: true,
        data: dicts.tradeStatus,
      }, {
        label: '到账时间',
        name: 'arriveTime',
        render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
      }, {
        label: '',
        name: 'id',
        hidden: true,
      },
    ];
    return (
      <div style={{ width: '100%' }} className="wallet">
        <Tabs
          defaultActiveKey="1"
        >
          <TabPane tab={<span className="wallet_h2">余额</span>} key="1">
            <div className="wallet_div">
              <div className="wallet_div_logo">
                <img
                  src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/pag_logo@3x.png"
                  alt="tubobo-2"
                />
                <span className="wallet_storeName">{JSON.parse(localStorage.getItem('storeName')) || '-'}</span>
              </div>
              <div className="wallet_div_money">
                <div className="wallet_div_money_balance">
                  <span className="wallet_balance"> 余额：</span>
                  <span className="wallet_balance wallet_balance_rmb"> <span>￥</span>{walletData.balance} </span>
                  <Button className="btnout" onClick={this.takeOutClick.bind(this)}>提现</Button>
                </div>
                <div className="wallet_div_money_div">
                  <div>
                    <span className="wallet_entryMoney"> 入驻保证金： </span>
                    <span className="wallet_entryMoney">{`￥${walletData.entryMoney}`}</span>
                  </div>
                  <div className="wallet_receiptMan_father">
                    <span className="wallet_receiptMan"> 收款方： </span>
                    <span className="wallet_receiptMan">{walletData.receiptMan}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="wallet_packageBill_button">
              <div className="wallet_packageBill_button1">
                <span>账户收支明细</span>
                <Button
                  onClick={() => {
                    browserHistory.push('/Manage/PackageBill');
                  }}
                >查看包裹寄存账单</Button>
              </div>
            </div>
            <ListPage
              loading={listLoading}
              page={page}
              columns={columns}
              data={data}
              searchParams={searchParams}
              changeSearch={this.props.changeSearch}
              search={this.paybillList.bind(this)}
              style={{
                padding: '0px',
              }}
            />
          </TabPane>
          <TabPane tab={<span className="wallet_h2">银行卡</span>} key="2">
            <div className="myBank">
              <p className="myBank_title">我的银行卡</p>
              <div className="bindBank" style={{ display: walletData.bankCardBinded ? 'none' : 'block' }}>
                <div className="nullBank">
                  <p>添加银行卡,可支持提现,仅支持一张银行卡</p>
                  <Button className="btn" onClick={onShowModal.bind(this, 'bindBank')}>绑定银行卡</Button>
                </div>
              </div>
              <div className="bindBank" style={{ display: walletData.bankCardBinded ? 'block' : 'none' }}>
                <div className="nullBank removeBank">
                  <div className="card">
                    <img
                      src={bankPicTypeData[bindbankData.bank]}
                      alt="2"
                    />
                    <div className="Wallet_bankStyle_bankNum">
                      {bindbankData.bankNum.replace(/\d{1,}(\d{4})/, '**** **** **** $1')}
                    </div>
                    <div className="Wallet_bankStyle_bankType"> {bindbankData.bankType} </div>
                  </div>
                  <Button
                    className="btn"
                    onClick={onShowModal.bind(this, 'unBindbank')}
                  >解除绑定</Button>
                </div>
              </div>
            </div>
            <div className="safeSetting" style={{ display: walletData.hasPassword ? 'none' : 'block' }}>
              <p className="myBank_title">安全设置</p>
              <div className="setSecret">
                <div className="nullsecret">
                  <a
                    tabIndex={-1}
                    className="set"
                    role="button"
                    onClick={onShowModal.bind(this, 'setEdit')}
                  >设置兔波波支付密码</a>
                  <p>通过兔波波支付密码校验身份完成提交等资金相关的操作</p>
                </div>
              </div>
            </div>
            <div className="editSetting" style={{ display: walletData.hasPassword ? 'block' : 'none' }}>
              <p className="myBank_title">安全设置</p>
              <div className="editSecret">
                <div className="nullsecret" style={{ marginTop: '20px' }}>
                  <a
                    className="set"
                    tabIndex={-2}
                    role="button"
                    onClick={onShowModal.bind(this, 'setEdit')}
                  >修改兔波波支付密码</a>
                  <p>通过原兔波波支付密码修改密码</p>
                </div>
                <div className="nullsecret" style={{ marginBottom: '20px' }}>
                  <a
                    className="set"
                    tabIndex={-3}
                    role="button"
                    onClick={this.getPhone.bind(this)}
                  >忘记兔波波支付密码</a>
                  <p>通过手机号和登陆密码修改密码</p>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <Bindbank
          {...this.props}
          visibleData={visibleData}
          record={record}
          errorExplain={errorExplain}
        />
        <SetEditSecret
          {...this.props}
          visibleData={visibleData}
          record={record}
          walletData={walletData}
          errorExplain={errorExplain}
        />
        <ForgetSecret
          {...this.props}
          visibleData={visibleData}
          record={record}
          errorExplain={errorExplain}
          getStorePhone={getStorePhone}
        />
        <Unbindbank
          {...this.props}
          visibleData={visibleData}
          record={record}
          errorExplain={errorExplain}
        />
      </div>
    );
  }
}

export default View;
