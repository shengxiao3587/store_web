import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';

export default class DoubleInput extends Component {
  audit(params) {
    const { props } = this;
    props.audit(params).then(() => {
      this.props.search({
        ...this.props.searchParams,
        ...this.props.page,
      });
    });
  }
  render() {
    const {
      data,
      dicts,
      loading,
      search,
      changeSearch,
      searchParams,
      riderButtonLoading,
      processStatus,
      page,
    } = this.props;
    const columns = [
      {
        label: '工号',
        name: 'riderCode',
        render: (text, record) =>
          (<a
            target="_blank"
            role="button"
            tabIndex={0}
            href={`/Manage/RiderDetail/${record.riderId}`}
          >{text}</a>),
      },
      {
        label: '骑手姓名',
        name: 'riderName',
        search: true,
      },
      {
        label: '联系方式',
        name: 'riderPhone',
        search: true,
      },
      {
        label: '身份证号',
        name: 'idCardNo',
      },
      {
        label: '审核状态',
        name: 'processStatus',
        type: 'select',
        search: true,
        data: dicts.riderStatus,
        render: (text, record) =>
          <span>{record.riderDelFlag !== undefined ? (processStatus[record.riderDelFlag][text] || '-') : '-'}</span>,
      },
      {
        label: '申请时间',
        name: 'createDate',
        render: (text) => DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
      },
      {
        label: '审核时间',
        name: 'updateDate',
        render: (text) => DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (
          record.processStatus === 'INIT'
            ? <span>
              <Button
                type="secondary"
                loading={riderButtonLoading}
                onClick={() => {
                  Modal.confirm({
                    iconType: '',
                    title: <span>审核通过后，该骑手将可以接单，<br />您确定通过审核吗？</span>,
                    onOk: this.audit.bind(this, { pass: true, workFlowId: record.workFlowId }),
                    onCancel: () => {},
                  });
                }}
              >通过</Button>
              <Button
                type="default"
                loading={riderButtonLoading}
                onClick={() => {
                  Modal.confirm({
                    iconType: '',
                    title: <span>审核不通过后，该骑手将不可以接单，<br />您确定不通过审核吗？</span>,
                    onOk: this.audit.bind(this, { pass: false, workFlowId: record.workFlowId }),
                    onCancel: () => {},
                  });
                }}
              >不通过</Button>
            </span>
            : <span>-</span>
        ),
      },
    ];
    return (<ListPage
      columns={columns}
      data={data}
      loading={loading}
      search={search}
      changeSearch={changeSearch}
      searchParams={searchParams}
      page={page}
      rowKey="workFlowId"
    />);
  }
}
