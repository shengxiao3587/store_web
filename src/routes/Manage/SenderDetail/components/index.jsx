import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Modal, Button } from 'antd';
import DetailPage from '../../../../components/DetailPage';
import './senderDetail.scss';
import { doConnect, doPrint } from '../../../../../lib/printAPI';

const payurl = require('../../../../../public/pay.svg');
const waitpayurl = require('../../../../../public/unpay.svg');
const unpayurl = require('../../../../../public/unpay2.svg');
const homeUrl = require('../../../../../public/home.svg');
const shopUrl = require('../../../../../public/shop.svg');

class View extends Component {
  componentDidMount() {
    this.senderSocket = doConnect(this.againCallback);
    const { props } = this;
    props.dict('expressCompany');
    props.dict('shipment');
    const paramsList = this.props.params.appointTaskId.split('&');
    this.props.detail({
      appointTaskId: paramsList[0],
      type: paramsList[1],
    });
  }
  componentWillUnmount() {
    this.senderSocket.close();
    this.props.modalStatus({
      visible: false,
    });
  }
  againCallback = (e) => {
    if (JSON.parse(e.data).cmd === 'print') {
      this.props.modalStatus({
        visible: true,
      });
    }
  }
  senderSocket;
  timerCount;
  handleSave(type, form) {
    form.validateFieldsAndScroll({ force: true }, (err, paramsTemp) => {
      if (!err) {
        const params = {
          ...paramsTemp,
          expressSheetType: type,
          paidFlag: paramsTemp.paid === true ? '2' : '0',
        };
        this.props.save(params).then((success) => {
          if (success) {
            if (type === '0') {
              doPrint(this.senderSocket, this.props.printData);
            } else {
              browserHistory.push('/Manage/SenderTask');
            }
          }
        });
      }
    });
  }
  handlePay() {
    this.props.handle({
      type: 'PAID',
      appointTaskId: this.props.data.appointTaskId,
    }).then((success) => {
      if (success) {
        const paramsList = this.props.params.appointTaskId.split('&');
        this.props.detail({
          appointTaskId: paramsList[0],
          type: paramsList[1],
        });
      }
    });
  }
  render() {
    const {
      data,
      dicts,
      loading,
      buttonLoading,
      detailOrEdit,
      paper,
      edition,
      paidFlag,
      visible,
    } = this.props;
    let paidFlagSrc;

    switch (paidFlag) {
      case '1':
        paidFlagSrc =
          '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-' +
          'web/waitpay@2x.png?x-oss-process=image/resize,p_50';
        paidFlagSrc = waitpayurl;
        break;
      case '2':
        paidFlagSrc = payurl;
        break;
      case '0':
      default:
        paidFlagSrc =
          '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/unpay2@2x.png?x-oss-process=image/resize,p_50';
        paidFlagSrc = unpayurl;
        break;
    }
    const fields = [
      {
        label: '寄件人信息',
        type: 'title',
        className: 'senderNew',
      },
      {
        label: '运单号',
        name: 'waybillNo',
        disabled: detailOrEdit,
        small: 12,
        // colon: false,
        // className: 'noRight',
        validator: (rule, value, callback) => {
          if (!value) {
            this.props.buttonStatus({
              ...this.props.valueObj,
              waybillNoValue: false,
            });
            callback();
            return;
          }
          if (!/^[a-zA-Z0-9]{8,20}$/.test(value)) {
            this.props.buttonStatus({
              ...this.props.valueObj,
              waybillNoValue: false,
            });
            callback('请输入8-20位数字或字母');
            return;
          }
          this.props.buttonStatus({
            ...this.props.valueObj,
            waybillNoValue: true,
          });
          callback();
        },
      },
      {
        label: '快递公司',
        name: 'expressCompanyId',
        type: 'select',
        disabled: detailOrEdit,
        required: !detailOrEdit,
        small: 12,
        // colon: !detailOrEdit,
        data: dicts.expressCompany,
      },
      {
        label: '姓名',
        name: 'appointTaskId',
        long: true,
        disabled: true,
        hidden: true,
      },
      {
        label: '寄件人',
        name: 'senderName',
        small: 12,
        disabled: detailOrEdit,
        // colon: !detailOrEdit,
        required: !detailOrEdit,
        max: 10,
      },
      {
        label: '寄件人电话',
        name: 'senderPhone',
        small: 12,
        disabled: detailOrEdit,
        // colon: !detailOrEdit,
        required: !detailOrEdit,
        fixedPhoneOrPhone: true,
        className: 'noRight',
      },
      {
        label: '寄件人地址',
        name: 'senderDetail',
        long: true,
        disabled: true,
        // colon: false,
        layoutData: {
          labelCol: { span: 12 },
        },
      },
      {
        label: '',
        name: 'senderAddressDetail',
        small: 24,
        placeholder: '请填写所在街道以及详细地址',
        type: 'textarea',
        minRows: 4,
        maxRows: 6,
        long: true,
        disabled: detailOrEdit,
        // colon: false,
        required: !detailOrEdit,
        max: 200,
      },
      {
        label: '',
        name: 'distributionDetails_div',
        long: true,
        type: 'div',
        disabled: true,
        className: 'distributionDetails_div',
        colon: false,
      },
      {
        label: '包裹信息',
        type: 'title',
        // titleBody: '（温馨提示：使用纸质面单请务必填写运单号及快递公司）',
        className: 'parcel',
      },
      {
        label: '物品类型',
        name: 'shipment',
        disabled: detailOrEdit || data.paidFlag !== '0',
        type: 'select',
        required: !detailOrEdit,
        small: 12,
        // colon: !detailOrEdit,
        data: dicts.shipment,
      },
      {
        label: '物品重量',
        name: 'weight',
        disabled: detailOrEdit || data.paidFlag !== '0',
        required: !detailOrEdit,
        small: 12,
        // colon: !detailOrEdit,
        className: 'noRight',
        onChange: (value) => {
          if (value && /^(([1-9]{1}\d{0,2})|(([0]\.([1-9]\d{0,1}|[0][1-9]))|([1-9]\d{0,2}\.\d{1,2})))$/.test(value)) {
            clearTimeout(this.timerCount);
            this.timerCount = setTimeout(() => {
              this.props.price({
                weight: value,
                sendType: data.sendType,
                senderProvinceCode: data.senderProvinceCode,
                senderCityCode: data.senderCityCode,
                receiverProvinceCode: data.receiverProvinceCode,
              }).then((success) => {
                if (!success) {
                  Modal.confirm({
                    title: '快递费用计算不成功？',
                    okText: '重试',
                    cancelText: '取消',
                    onOk: () => {
                      this.props.price({
                        weight: value,
                        sendType: data.sendType,
                        senderProvinceCode: data.senderProvinceCode,
                        receiverProvinceCode: data.receiverProvinceCode,
                      });
                    },
                  });
                }
              });
            }, 1000);
          }
        },
        validator: (rule, value, callback) => {
          if (!value) {
            this.props.buttonStatus({
              ...this.props.valueObj,
              weightValue: false,
            });
            callback();
            return;
          }
          if (!/^(([1-9]{1}\d{0,2})|([0]\.([1-9]\d{0,1}|[0][1-9]))|([1-9]\d{0,2}\.\d{1,2}))$/.test(value)) {
            this.props.buttonStatus({
              ...this.props.valueObj,
              weightValue: false,
            });
            callback('请输入0.01-999.99的数字');
            return;
          }
          this.props.buttonStatus({
            ...this.props.valueObj,
            weightValue: true,
          });
          callback();
        },
      },
      {
        label: '',
        name: 'distributionDetails_div2',
        long: true,
        type: 'div',
        disabled: true,
        className: 'distributionDetails_div',
        colon: false,
      },
      {
        label: '收件人信息',
        type: 'title',
        className: 'recipient',
      },
      {
        label: '收件人',
        name: 'receiverName',
        disabled: detailOrEdit,
        required: !detailOrEdit,
        small: 12,
        // colon: !detailOrEdit,
        max: 10,
      },
      {
        label: '收件人电话',
        name: 'receiverPhone',
        small: 12,
        disabled: detailOrEdit,
        // colon: !detailOrEdit,
        required: !detailOrEdit,
        fixedPhoneOrPhone: true,
        className: 'noRight',
      },
      {
        label: '收件人地址',
        name: 'receiverDetail',
        long: true,
        disabled: true,
        // colon: false,
        layoutData: {
          labelCol: { span: 12 },
        },
      },
      {
        label: '',
        name: 'receiverAddressDetail',
        type: 'textarea',
        placeholder: '请填写所在街道以及详细地址',
        minRows: 4,
        maxRows: 6,
        small: 24,
        colon: false,
        disabled: detailOrEdit,
        required: !detailOrEdit,
        long: true,
        max: 200,
      },
      {
        label: '备注',
        name: 'remark',
        placeholder: '请填写相关备注说明',
        type: 'textarea',
        long: true,
        minRows: 4,
        maxRows: 6,
        disabled: detailOrEdit,
        // colon: !detailOrEdit,
        className: 'noRight',
        max: 200,
      },
      {
        label: '寄出时间',
        name: 'finishTime',
        disabled: true,
        // colon: false,
        long: true,
        hidden: data.sendStatus !== 'FINISH',
        className: 'noRight',
      },
      {
        label: '支付状态',
        name: 'paid',
        long: true,
        type: 'switch',
        hidden: detailOrEdit || data.paidFlag === '2' || (data.paidFlag === '0' && data.sendType === '1'),
        checkedChildren: '已支付',
        unCheckedChildren: '未支付',
        colon: false,
        className: 'noRight',
      },
      {
        label: '',
        name: 'distributionDetails_div1',
        long: true,
        type: 'div',
        disabled: true,
        className: 'distributionDetails_divlast',
        colon: false,
      },
      {
        label: '上门费用(元)',
        name: 'payDoor',
        disabled: true,
        small: 24,
        // colon: false,
      },
      {
        label: '快递费用(元)',
        name: 'cost',
        disabled: true,
        small: 24,
        // colon: false,
        className: 'noRight',
      },
      {
        label: '优惠金额(元)',
        name: 'discountFee',
        disabled: true,
        small: 24,
        // colon: false,
        className: 'noRight',
      },
      {
        label: '应收金额(元)',
        name: 'costNum',
        // long: data.sendStatus !== 'FINISH',
        disabled: true,
        small: 12,
        // colon: false,
        // hidden: data.paidFlag === '0',
      },
      {
        label: '实收金额(元)',
        name: 'actuallyFee',
        disabled: true,
        small: 8,
        className: 'actuallyFee',
      },
    ];
    const buttons = [
      {
        label: '使用纸质面单',
        onClick: this.handleSave.bind(this, '1'),
        hidden: detailOrEdit,
        disabled: paper,
        loading: buttonLoading,
        type: 'secondary',
        style: { background: '#ffd800', border: 'none' },
      }, {
        label: '打印电子面单',
        onClick: this.handleSave.bind(this, '0'),
        hidden: detailOrEdit,
        disabled: edition,
        loading: buttonLoading,
        type: 'secondary',
        style: { background: '#ffd800', border: 'none' },
      },
    ];
    return (
      <div style={{ width: '100%' }}>
        <Modal
          visible={visible}
          maskClosable={false}
          title="电子面单打印结果"
          onCancel={() => {
            this.props.modalStatus({
              visible: false,
            });
          }}
          footer={[
            <Button
              key="submit"
              type="default"
              size="large"
              loading={loading}
              onClick={() => {
                doPrint(this.senderSocket, this.props.printData);
              }}
            >
              不成功，再试一次
            </Button>,
            <Button
              key="back"
              size="large"
              type="primary"
              onClick={() => {
                this.props.handle({
                  type: 'PRINTED',
                  appointTaskId: this.props.data.appointTaskId,
                }).then((success) => {
                  if (success) {
                    browserHistory.push('/Manage/SenderTask');
                  }
                });
              }}
            >
              打印成功
            </Button>,
          ]}
        >
          <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>电子面单打印是否成功？</p>
        </Modal>
        {
          detailOrEdit && data.sendStatus !== 'CANCEL' && data.paidFlag === '1' &&
            <div className="senderDetail_pay">用户是否已支付寄件费用？
              <a
                target="_blank"
                role="button"
                tabIndex={0}
                onClick={this.handlePay.bind(this)}
              >&nbsp;&nbsp;&nbsp;&nbsp;点击确认付款</a>
            </div>
        }
        <div className="senderDetail">
          <div className="senderDetail_title">
            <span>寄件详情</span>
            {
              data.sendType === '0' ?
                <img
                  src={
                    // '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-' +
                    // 'storedesk-web/shop@2x.png?x-oss-process=image/resize,p_50'
                    shopUrl
                  }
                  alt="tubobo-2"
                />
                : <img
                  src={
                    // '//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-sto' +
                    // 'redesk-web/home@2x.png?x-oss-process=image/resize,p_50'
                    homeUrl
                  }
                  alt="tubobo-2"
                />
            }
            <img className="paidFlagImg" src={paidFlagSrc} alt="是否付款" />
          </div>
          <div className="personCenter">
            <DetailPage
              fields={fields}
              values={data}
              buttons={buttons}
              loading={loading}
              changeRecord={this.props.changeRecord}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default View;
