/**
 * Created by xiaolb on 2018/1/17.
 */
import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';

export default class FinishExpress extends Component {
  render() {
    const {
      sendTypeStatus,
      paidFlagStatus,
    } = this.props;
    const columns = [
      {
        label: '运单号',
        name: 'waybillNo',
        render: (text, record) => ((record.expressCompanyName && text) ?
          (<a
            href={`/Manage/SenderDetail/${record.appointTaskId}&detail`}
            target="_blank"
            role="button"
            tabIndex={-31}
            className="SenderTask_a"
          >
            <span className="senderTask_expressCompany">{record.expressCompanyName}</span>
            <span className="senderTask_click">{text}</span>
          </a>) : (<a
            href={`/Manage/SenderDetail/${record.appointTaskId}&detail`}
            target="_blank"
            role="button"
            tabIndex={-32}
            className="senderTask_expressCompany noexitWaybillNo"
          >暂无运单号</a>)
        ),
      }, {
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
      }, {
        label: '联系方式',
        name: 'senderPhone',
        hidden: true,
        search: true,
      }, {
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
      }, {
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
      }, {
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
        label: '寄出时间',
        name: 'finishTime',
      },
      {
        label: '支付状态',
        name: 'paidFlag',
        type: 'select',
        data : paidFlagStatus,
        search: true,
        hidden: true,
      }, {
        label: '下单时间',
        name: 'orderTime',
      }, {
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
      },
    ];
    return (
      <ListPage
        {...this.props}
        columns={columns}
      />
    );
  }
}
