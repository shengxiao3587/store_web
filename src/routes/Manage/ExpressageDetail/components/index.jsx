import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import './expressDetail.css';

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('allExpressCompany');
    props.detail({ waybillNo : props.params.id });
  }

  render() {
    const {
      waybillStatus,
      waybillStatusData,
      data,
      dicts,
    } = this.props;

    const fields = [
      {
        label: '退回原因',
        forbidRed: true,
        name: 'returnReason',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 5,
      },
      { label: '运单号', name: 'waybillNo', className: 'xg', simpleHalf: true, disabled: true },
      {
        label: '合作对象',
        name: 'bindMan',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
      },
      {
        label: '快递公司',
        name: 'expressCompany',
        className: 'xg',
        simpleHalf: true,
        type: 'select',
        disabled: true,
        data: dicts.allExpressCompany,
      },
      { label: '收件人', name: 'receiverPhone', className: 'xg', simpleHalf: true, disabled: true },
      { label: '取件号', name: 'areaNum', className: 'xg', simpleHalf: true, disabled: true },
      { label: '在库时长', name: 'remainDay', className: 'xg', simpleHalf: true, disabled: true },
      {
        label: '交接人',
        name: 'updateOperator',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 0,
      },
      {
        label: '交接时间',
        name: 'updateTime',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 0,
      },
      {
        label: '入库人',
        name: 'inOperator',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus === 0,
      },
      { label: '入库时间', name: 'inTime', className: 'xg', simpleHalf: true, disabled: true, hidden: waybillStatus === 0 },
      {
        label: '出库人',
        name: 'outOperator',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 2,
      },
      {
        label: '出库时间',
        name: 'outTime',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 2,
      },
      {
        label: '签收人',
        name: 'signOperator',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 3,
      },
      {
        label: '签收时间',
        name: 'signTime',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 3,
      },
      {
        label: '退回人',
        name: 'returnOperator',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden:waybillStatus !== 5,
      },
      {
        label: '退回时间',
        name: 'returnTime',
        className: 'xg',
        simpleHalf: true,
        disabled: true,
        hidden: waybillStatus !== 5,
      },
    ];

    return (
      <div className="ant-content-inner expressDeatil">
        <h2 className="title">包裹详情 - {waybillStatusData[waybillStatus]}</h2>
        <div className="detail">
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
