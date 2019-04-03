/**
 * Created by xiaolb on 2018/1/17.
 */
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import ListPage from '../../../../components/ListPage';
import { doConnect, doPrint } from '../../../../../lib/printAPI';

export default class SendExpress extends Component {
  componentDidMount() {
    this.senderSocket = doConnect();
  }
  componentWillUnmount() {
    this.senderSocket.close();
  }
  senderSocket;
  printIn(record) {
    const {
      modalShow,
    } = this.props;
    const params = {
      ...record,
      type: 'sender',
    };
    modalShow(params);
  }
  printSuccess() {
    const {
      senderOrprint,
      appointTaskId,
      search,
      searchParams,
      page,
    } = this.props;
    senderOrprint({
      type: 'coverPrint',
      appointTaskId,
    }).then(() => {
      search({
        ...searchParams,
        ...page,
      });
    });
  }
  sender(appointTaskId) {
    const {
      // 关闭任务
      senderOrprint,
      search,
      searchParams,
      page,
    } = this.props;
    senderOrprint({
      type: 'SEND',
      appointTaskId,
    }).then(() => {
      search({
        ...searchParams,
        ...page,
      });
    });
  }
  render() {
    const {
      sendTypeStatus,
      paidFlagStatus,
      printData,
      buttonLoadingData,
      that,
      visibleSend,
      cancel,
    } = this.props;
    const columns = [
      {
        label: '运单号',
        name: 'waybillNo',
        render: (text, record) => (
          <a
            href={`/Manage/SenderDetail/${record.appointTaskId}&detail`}
            target="_blank"
            role="button"
            tabIndex={-31}
            className="SenderTask_a"
          >
            <span className="senderTask_expressCompany">{record.expressCompanyName}</span>
            <span className="senderTask_click">{text}</span>
          </a>
        ),
      },
      {
        label: '寄件人',
        name: 'senderName',
        search: true,
        render: (text, record) => (
          <div
            className="distributionTask_distributionStatus"
            title={`${text || ''}\n${record.senderPhone || ''}`}
          >
            <span>{text.replace(/.{1,}(.{1})/, '**$1')}</span>
            <span>
              {record.senderPhone && record.senderPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </span>
          </div>
        ),
      },
      {
        label: '联系方式',
        name: 'senderPhone',
        hidden: true,
        search: true,
      },
      {
        label: '收件人',
        name: 'receiverName',
        render: (text, record) => (
          <div
            className="distributionTask_distributionStatus"
            title={`${text || ''}\n${record.receiverPhone || ''}`}
          >
            <span>{text.replace(/.{1,}(.{1})/, '**$1')}</span>
            <span>
              {record.receiverPhone && record.receiverPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </span>
          </div>
        ),
      },
      {
        label: '收件地址',
        name: 'receiverAddress',
        render: (text) => (
          <span
            className="addressReceived"
            title={text}
          >
            {text}
          </span>
        ),
      },
      {
        label: '寄件类型',
        name: 'sendType',
        type: 'select',
        data: sendTypeStatus,
        search: true,
        render: (text) => ((text === '0' || text === '1') && sendTypeStatus[text].label),
      },
      {
        label: '应收金额',
        name: 'costNum',
      },
      {
        label: '实付金额',
        name: 'actuallyFee',
        render: (text, record) => {
          let paidFlag;
          switch (record.paidFlag) {
            case '0':
              paidFlag = '未付款';
              break;
            case '1':
              paidFlag = '待付款';
              break;
            case '2':
              paidFlag = '已付款';
              break;
            default:
              break;
          }
          return (<div>
            { record.paidFlag !== '0' &&
            <p>{text}</p>
            }
            <span>{paidFlag}</span>
          </div>);
        },
      },
      {
        label: '支付状态',
        name: 'paidFlag',
        type: 'select',
        data : paidFlagStatus,
        search: true,
        hidden: true,
      },
      {
        label: '下单时间',
        name: 'orderTime',
      },
      {
        label: '时间',
        name: 'sendTime',
        search: true,
        required: true,
        hidden: true,
        type: 'twodateRange',
        validator: (rule, values, callback) => {
          if (!values.startValue && !values[0]) {
            callback('请输入开始时间');
          }
          if (!values.endValue && !values[1]) {
            callback('请输入结束时间');
          }
          callback();
        },
      }, {
        label: '操作',
        name: 'action',
        render: (text, record) => (
          <div className="senderTask_Left">
            <Button
              type="primary"
              loading={buttonLoadingData.send}
              onClick={this.sender.bind(this, record.appointTaskId)}
            >寄出</Button>
            {
              record.printData &&
              <Button
                type="default"
                loading={buttonLoadingData.print}
                onClick={this.printIn.bind(this, record)}
              >重新打印面单</Button>
            }
            {
              record.paidFlag !== '2' &&
              <Button
                type="danger"
                className="distributionTask_button"
                loading={buttonLoadingData.close}
                onClick={() => {
                  Modal.confirm({
                    iconType: '',
                    title: <span>关闭后该条订单将被取消，确定<br />要关闭该订单吗？</span>,
                    onOk: this.props.close.bind(that, { appointTaskId: record.appointTaskId }),
                    onCancel: () => {},
                  });
                }}
              >关闭</Button>
            }
          </div>
        ),
      },
    ];
    return (
      <div>
        <ListPage
          {...this.props}
          columns={columns}
        />
        <Modal
          title="电子面单打印结果"
          visible={visibleSend}
          onCancel={cancel}
          maskClosable={false}
          footer={[
            <Button
              size="large"
              key="back"
              type="default"
              onClick={cancel}
            >取消</Button>,
            <Button
              key="submit"
              size="large"
              type="primary"
              onClick={() => {
                doPrint(this.senderSocket, printData);
                cancel();
              }}
            >
              打印</Button>,
          ]}
        >
          <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>电子面单打印是否成功？</p>
        </Modal>
      </div>
    );
  }
}
