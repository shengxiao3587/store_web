import React, { Component } from 'react';
import './pickup.scss';
import CommonSetting from './CommonSetting';
import SpecialSetting from './SpecialSetting';

class View extends Component {
  componentDidMount() {
    this.props.checkSearch();
    this.props.searchStoreStatus();
  }

  handleChange(type, e) {
    this.props.update({
      ...this.props.setType,
      [type]: +(e.target.value),
    });
  }

  render() {
    const {
      areaNumData,
      pickUpData,
      serverData,
      senderData,
      exitData,
      setType,
      // 营业进程
      storeStatus,
      loading,
      // 判断是停业申请还是营业申请，1为停业申请，0为营业申请
      applyStatus,
      // 审核中或失败的原因详情
      record,
    } = this.props;
    const fields = [
      {
        label: '申请时间',
        name: 'applyTime',
        simple: true,
        // 只有审核中或者审核失败的时候展示
        hidden: storeStatus.processStatus === 0,
        long: true,
        disabled: true,
      },
      {
        label: applyStatus ? '停业申请' : '营业申请',
        name: 'reason',
        simple: true,
        required: true,
        type: 'textarea',
        long: true,
        // 审核中或者审核失败的时候不可编辑
        disabled: storeStatus.processStatus !== 0,
        max: 50,
      },
    ];
    return (
      <div className="pickup">
        <span className="pickup_h2">操作设置</span>
        {/* 取件号设置 */}
        <CommonSetting
          setData={areaNumData}
          that={this}
          setType={setType.areaNumType}
          loading={loading}
          className="areaNum"
        />
        {/* 取件通知设置 */}
        <CommonSetting
          {...this.props}
          setData={pickUpData}
          that={this}
          setType={setType.pickUpType}
          loading={loading}
          className="pickUp"
        />
        {/* 预约配送设置 */}
        <SpecialSetting
          {...this.props}
          setData={serverData}
          that={this}
          setType={setType.distributionOpenFlag}
          processStatus={setType.distributionProcessStatus}
          loading={loading}
        />
        {/* 寄件设置 */}
        <SpecialSetting
          {...this.props}
          setData={senderData}
          that={this}
          setType={setType.sendOpenFlag}
          processStatus={setType.sendProcessStatus}
          loading={loading}
        />
        {/*
         营业设置:审核中没有按钮
        */}
        <SpecialSetting
          {...this.props}
          setData={exitData}
          that={this}
          setType={storeStatus.operation}
          processStatus={storeStatus.processStatus}
          loading={loading}
          fields={fields}
          record={record}
          hasModal
          hasFooter={storeStatus.processStatus === 1 ? 1 : 0}
        />
      </div>
    );
  }
}

export default View;
