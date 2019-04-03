import React, { Component } from 'react';
import { Steps } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import DetailPage from '../../../../components/DetailPage';
import './distributionDetail.scss';

const Step = Steps.Step;
class View extends Component {
  componentDidMount() {
    this.props.detail({
      ...this.props.params,
    });
  }
  taskTrack(num, type) {
    const taskTrackList = this.props.taskTrackList;
    if (taskTrackList[num] && taskTrackList[num].status === type) {
      return DateUtil.formatDate(taskTrackList[num].time, 'yyyy-MM-dd HH:mm');
    }
    return '';
  }
  render() {
    const {
      stepNum,
      stepStatus = 'wait',
      distributionStatus,
      data,
      cancelTime,
      status,
    } = this.props;
    const fields = [{
      label: '订单信息',
      type: 'title',
    }, {
      label: '预约时间',
      name: 'appointTime',
      disabled: true,
      colon: false,
    }, {
      label: '配送费(元)',
      name: 'payDistribution',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '快递信息',
      name: 'receiveDetail',
      type: 'doubleInput',
      disabled: true,
      colon: false,
      className: 'receiveDetail_scale',
    }, {
      label: '取件号',
      name: 'areaNum',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '收件人信息',
      name: 'addresseeDetail',
      type: 'doubleInput',
      long: true,
      disabled: true,
      istextarea: true,
      className: (status === 'FINISH' || status === 'CANCEL')
        ? 'no_rightBorder addressee_nocolor' : 'no_rightBorder addressee_scale',
      colon: false,
    }, {
      label: '任务编码',
      name: 'taskNum',
      long: true,
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '备注(非必填)',
      name: 'remark',
      long: true,
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '',
      name: 'distributionDetails_div',
      long: true,
      type: 'div',
      disabled: true,
      className: 'distributionDetails_div',
      colon: false,
    }, {
      label: '骑手信息',
      type: 'title',
      hidden: status === 'RECEIVE',
    }, {
      label: '骑手ID',
      name: 'riderId',
      disabled: true,
      colon: false,
      hidden: status === 'RECEIVE',
    }, {
      label: '骑手信息',
      name: 'riderDetail',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
      hidden: status === 'RECEIVE',
    }];
    return (
      <div style={{ width: '100%' }} className="distributionDetails">
        <div className="distributionDetails_title">
          <span>配送任务详情</span>
          <p>{distributionStatus || '-'}</p>
        </div>
        <div className="distributionDetails_body">
          {
            cancelTime && <div className="distributionDetails_body_cancel">
              <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/cancel%402x.png" alt="tubobo-2" />
              <div>
                {`已取消  ${DateUtil.formatDate(cancelTime, 'yyyy-MM-dd HH:mm')}`}
                <br />
                {`${data.cancelReason || '-'}`}
              </div>
            </div>
          }
          <div className="distributionDetails_step">
            <Steps current={stepNum} status={stepStatus} >
              <Step
                title="已下单"
                description={this.taskTrack(0, 'RECEIVE')}
                icon={
                  stepNum < 1
                    ? <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_1@2x.png"
                      alt="tubobo-2"
                    />
                    : <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_1@2x.png"
                      alt="tubobo-2"
                    />
                }
              />
              <Step
                title="已接单"
                description={this.taskTrack(1, 'PICKUP')}
                icon={
                  stepNum < 2 ?
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_2@2x.png"
                      alt="tubobo-2"
                    /> :
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_2@2x.png"
                      alt="tubobo-2"
                    />
                }
              />
              <Step
                title="已取货"
                description={this.taskTrack(2, 'DISTRIBUTION')}
                icon={
                  stepNum < 3 ?
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_3@2x.png"
                      alt="tubobo-2"
                    /> :
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_3@2x.png"
                      alt="tubobo-2"
                    />
                }
              />
              <Step
                title="已完成"
                description={this.taskTrack(3, 'FINISH')}
                icon={
                  stepNum > 3 ?
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_4@2x.png"
                      alt="tubobo-2"
                    /> :
                    <img
                      src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_4@2x.png"
                      alt="tubobo-2"
                    />
                }
              />
            </Steps>
          </div>
        </div>
        <div className="personCenter distributionDetails_detail">
          <DetailPage
            fields={fields}
            values={data}
          />
        </div>
      </div>
    );
  }
}

export default View;
