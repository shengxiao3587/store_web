/**
 * Created by xiaolb on 2018/1/17.
 */
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { browserHistory } from 'react-router';
import ListPage from '../../../../components/ListPage';
import { doConnect, doPrint } from '../../../../../lib/printAPI';

export default class WaitExpress extends Component {
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
      type: 'dealwith',
    };
    doPrint(this.senderSocket, record.printData);
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
      type: 'PRINTED',
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
      buttonLoadingData,
      printData,
      visibleDealWith,
      that,
      cancel,
    } = this.props;
    const columns = [
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
        label: '寄件地址',
        name: 'senderAddress',
        render:(text, record) => (<a
          href={`/Manage/SenderDetail/${record.appointTaskId}&detail`}
          target="_blank"
          role="button"
          tabIndex={0}
          className="senderTask_click"
          title={text}
        >
          {text}
        </a>),
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
      },
      {
        label: '预约时间',
        name: 'appointTime',
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (
          <div className="senderTask_Left">
            {
              record.printFlag === '0' && (record.sendStatus === 'HANDLE' || record.sendType === '0') &&
              <Button
                type="default"
                onClick={() => { browserHistory.push(`/Manage/SenderDetail/${record.appointTaskId}&edit`); }}
              >填写运单</Button>
            }
            {
              record.printFlag === '1' &&
              <Button
                type="default"
                loading={buttonLoadingData.print}
                onClick={this.printIn.bind(this, record)}
              >打印面单</Button>
            }
            {
              record.paidFlag !== '2' &&
              <Button
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
              >&nbsp;&nbsp;关&nbsp;&nbsp;&nbsp;闭&nbsp;&nbsp;</Button>
            }
          </div>
        ),
      },
    ];
    const parenthesisNode = (
      <div className="waitExpress_span">
        使用电子面单时，请先下载
        <a href="http://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe">菜鸟打印</a>。
      </div>
    );
    return (
      <div>
        <ListPage
          {...this.props}
          columns={columns}
          parenthesisNode={parenthesisNode}
        />
        <Modal
          title="电子面单打印结果"
          visible={visibleDealWith}
          onCancel={cancel}
          maskClosable={false}
          footer={[
            <Button
              size="large"
              key="back"
              type="default"
              onClick={() => doPrint(this.senderSocket, printData)}
            >不成功，再试一次</Button>,
            <Button
              key="submit"
              size="large"
              type="primary"
              onClick={this.printSuccess.bind(this)}
            >
              打印成功</Button>,
          ]}
        >
          <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>电子面单打印是否成功？</p>
        </Modal>
      </div>
    );
  }
}
