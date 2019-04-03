import React, { Component } from 'react';
import { Tabs, Button, Modal } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import './distributionTask.css';

const TabPane = Tabs.TabPane;

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('waitTaskStatus');
    props.dict('finishTaskStatus');
    props.dict('expressCompany');
    props.waitTasksearch({
      ...this.props.waitPage,
      ...this.props.waitTaskParams,
    });
    props.finishTasksearch({
      ...this.props.finishPage,
      ...this.props.finishTaskParams,
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  tabsChange(key) {
    this.props.tabsChange(key);
  }
  close(params) {
    const { props } = this;
    props.close(params).then(() => {
      this.props.waitTasksearch({
        ...this.props.waitTaskParams,
        ...this.props.waitPage,
      });
    });
  }
  render() {
    const {
      activeKey,
      waitData,
      finishData,
      dicts,
      // 任务状态
      distributionStatus,
      loading,
      waitTaskParams,
      finishTaskParams,
      changeSearch,
      finishPage,
      waitPage,
      buttonLoading,
    } = this.props;
    const columns = [{
      label: '运单号',
      name: 'waybillNo',
      search: true,
      render: (text, record) => (
        <a
          target="_blank"
          role="button"
          tabIndex={0}
          href={`/Manage/DistributionDetail/${record.appointTaskId}`}
          className="distributionTask_a"
        >
          <span className="distributionTask_expressCompany">{record.expressCompany}</span>
          <span className="distributionTask_waybillNo">{text}</span>
        </a>
      ),
    }, {
      label: '快递公司',
      name: 'expressCompanyId',
      type: 'select',
      data: dicts.expressCompany,
      search: true,
      hidden: true,
    }, {
      label: '取件号',
      name: 'areaNum',
      search: true,
    }, {
      label: '收件人',
      name: 'receiverName',
      search: true,
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
      label: '联系方式',
      name: 'receiverPhone',
      search: true,
      hidden: true,
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
      label: '任务状态',
      name: 'distributionStatus',
      type: 'select',
      data: activeKey === '1' ? dicts.finishTaskStatus : dicts.waitTaskStatus,
      search: true,
      render: (text, record) => (<div className="distributionTask_distributionStatus">
        <span>{record.payDistribution || '-'}</span>
        <span>{distributionStatus[text]}</span>
      </div>),
    }, {
      label: '下单时间',
      name: 'orderTime',
      search: true,
      required: true,
      type: 'twodateRange',
      render: (text) => DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
      validator: (rule, values, callback) => {
        const haveStart = values.startValue || values[0];
        const haveEnd = values.endValue || values[1];
        if (!haveStart) { return callback('请输入开始时间'); }
        if (!haveEnd) { return callback('请输入结束时间'); }
        return callback();
      },
    }, {
      label: '预约时间',
      name: 'appointTime',
    }, {
      label: '操作',
      name: 'action',
      hidden: activeKey === '1',
      render: (text, record) => (
        record.distributionStatus === 'RECEIVE' ?
          <Button
            className="distributionTask_button"
            loading={buttonLoading}
            onClick={() => {
              Modal.confirm({
                iconType: '',
                title: <span>关闭后配送任务将终止，用户需再次发起配送需求<br />您确定要关闭吗？</span>,
                onOk: this.close.bind(this, { appointTaskId: record.appointTaskId }),
                onCancel: () => {},
              });
            }}
          >关闭</Button>
          : <div>-</div>
      ),
    }];
    return (
      <div style={{ width: '100%' }} className="distributionTask">
        <Tabs
          onChange={this.tabsChange.bind(this)}
          activeKey={activeKey}
        >
          <TabPane tab="待处理" key="0">
            <ListPage
              loading={loading}
              page={waitPage}
              columns={columns}
              data={waitData}
              rowKey="appointTaskId"
              searchParams={waitTaskParams}
              changeSearch={(record) => {
                changeSearch({ ...record, type: 0 });
              }}
              search={this.props.waitTasksearch}
            />
          </TabPane>
          <TabPane tab="已完成" key="1">
            <ListPage
              loading={loading}
              page={finishPage}
              columns={columns}
              data={finishData}
              rowKey="appointTaskId"
              searchParams={finishTaskParams}
              changeSearch={(record) => {
                changeSearch({ ...record, type: 1 });
              }}
              search={this.props.finishTasksearch}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default View;
