import React, { Component } from 'react';
import { DateUtil } from '@xinguang/common-tool';
import { Button, Modal } from 'antd';
import DetailPage from '../../../../components/DetailPage';
import Table from '../../../../components/Table';
import './riderDetail.scss';

class View extends Component {
  componentDidMount() {
    this.props.detail({
      ...this.props.params,
    });
  }
  audit(params) {
    const { props } = this;
    props.audit(params).then(() => {
      this.props.detail({
        ...this.props.params,
      });
    });
  }
  render() {
    const {
      data,
      loading,
      processStatus,
      riderButtonLoading,
      buttonProcessStatus,
    } = this.props;
    const fields = [{
      label: '基本信息',
      type: 'title',
    }, {
      label: '骑手编号',
      name: 'riderCode',
      disabled: true,
      colon: false,
    }, {
      label: '资金账户ID',
      name: 'accountId',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '骑手姓名',
      name: 'riderName',
      disabled: true,
      colon: false,
    }, {
      label: '联系电话',
      name: 'riderPhone',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '身份证号',
      name: 'idCardNo',
      disabled: true,
      colon: false,
    }, {
      label: '申请时间',
      name: 'createDate',
      disabled: true,
      className: 'no_rightBorder',
      colon: false,
    }, {
      label: '所属门店',
      name: 'storeName',
      long: true,
      disabled: true,
      className: 'bottomBorder',
      colon: false,
    }, {
      label: '身份证正面照',
      picture: 'picture-card',
      name: 'idCardFront',
      type: 'AntdUpload',
      picName: '门店照片',
      disabled: true,
      className: 'personCenter_div_picture',
      small: 8,
      colon: false,
      multiple: true,
      data: {
        bucketType: 'private',
        projectName: 'serviceProvider',
        token: localStorage.getItem('accessToken'),
      },
    }, {
      label: '身份证反面照',
      picture: 'picture-card',
      name: 'idCardBack',
      type: 'AntdUpload',
      picName: '门店照片',
      disabled: true,
      className: 'personCenter_div_picture',
      small: 8,
      colon: false,
      multiple: true,
      data: {
        bucketType: 'private',
        projectName: 'serviceProvider',
        token: localStorage.getItem('accessToken'),
      },
    }];
    const columns = [{
      label: '操作记录',
      name: 'processStatusName',
    }, {
      label: '操作时间',
      name: 'createDate',
      render: (text) => DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
    }, {
      label: '操作人',
      name: 'name',
    }];
    return (
      <div style={{ width: '100%' }} className="riderDetail">
        <div className="personCenter distributionDetails_detail">
          <div className="riderDetail_title">
            <div>
              <span>骑手信息</span>
              <span className={`riderDetail_title_${data.riderDelFlag === '0' ? data.processStatus : 'freeze'}`}>
                {processStatus}
              </span>
            </div>
            {
              buttonProcessStatus === 'INIT' &&
              <div>
                <Button
                  type="secondary"
                  loading={riderButtonLoading}
                  onClick={() => {
                    Modal.confirm({
                      iconType: '',
                      title: <span>审核通过后，该骑手将可以接单，<br />您确定通过审核吗？</span>,
                      onOk: this.audit.bind(this, { pass: true, workFlowId: data.workFlowId }),
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
                      onOk: this.audit.bind(this, { pass: false, workFlowId: data.workFlowId }),
                      onCancel: () => {},
                    });
                  }}
                >不通过</Button>
              </div>
            }
          </div>
          <DetailPage
            loading={loading}
            fields={fields}
            values={data}
          />
        </div>
        <div className="riderDetail_table">
          <div className="ant-form-title">审核情况</div>
          <Table
            columns={columns}
            dataSource={data.workFlowRecordList}
            loading={loading}
            tableRowKey="createDate"
          />
        </div>
      </div>
    );
  }
}

export default View;
