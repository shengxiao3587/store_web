import React, { Component } from 'react';
import moment from 'moment';
import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import './packageBill.scss';


class View extends Component {
  componentDidMount() {
    const { props } = this;
    const createDate = {
      value:[
        moment(),
        moment(),
      ],
      type: 'twodateRange',
    };
    props.dict('tucaibaoType');
    props.dict('countStatus');
    props.dict('expressCompany');
    props.search({
      createDate,
      pageSize: 10,
      pageNo: 1,
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  render() {
    const {
      dayData,
      loading,
      dayParams,
      changeSearch,
      dicts,
      dayPage,
      cooperatorData,
    } = this.props;
    const columns = [{
      label: '创建时间',
      required: true,
      name: 'createDate',
      search: true,
      type: 'twodateRange',
      render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
      validator: (rule, values, callback) => {
        const haveStart = values.startValue || values[0];
        const haveEnd = values.endValue || values[1];
        if (!haveStart) { return callback('请输入开始时间'); }
        if (!haveEnd) { return callback('请输入结束时间'); }
        return callback();
      },
    }, {
      label: '结算单号',
      name: 'billNo',
    }, {
      label: '合作对象',
      name: 'cooperatorId',
      type: 'select',
      valueName: 'cooperatorId',
      displayName: 'cooperatorName',
      showSearch: true,
      action: this.props.cooperatorSearch,
      page: cooperatorData,
      appendToBody: true,
      search: true,
      render: (text, record) => (
        <div>
          <p>{record.cooperatorName}</p>
          <p>{record.cooperatorPhone}</p>
        </div>
      ),
    }, {
      label: '运单号',
      name: 'waybillNo',
      search: true,
      render: (text, record) => (
        <div className="packageBill_waybillno_div1">
          <div className="packageBill_waybillno_div2">
            <span className="distributionTask_expressCompany">{record.expressCompanyName}</span>
            <span className="distributionTask_waybillNo">{text}</span>
          </div>
        </div>
      ),
    }, {
      label: '合作对象联系电话',
      name: 'cooperatorPhone',
      search: true,
      hidden: true,
    }, {
      label: '所属快递',
      name: 'expressCompanyId',
      search: true,
      hidden: true,
      type: 'select',
      data: dicts.expressCompany,
    }, {
      label: '账单金额（元）',
      name: 'billMoney',
    }, {
      label: '签收时间',
      name: 'signDate',
      render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
    }, {
      label: '结算状态',
      name: 'settleStatus',
      search: true,
      type: 'select',
      data: dicts.countStatus,
    }];
    const buttons = [
      {
        label: '导出',
        onClick: () => {
          const { createDate } = dayParams;
          if (createDate.value[0] === null || createDate.value[1] === null) {
            message.error('请选择时间');
          } else {
            const start = moment(createDate.value[0]).format('YYYY-MM-DD');
            const end = moment(createDate.value[1]).format('YYYY-MM-DD');
            if (moment(start).add(1, 'months').subtract(1, 'days').isBefore(moment(end))) {
              message.error('导出时间跨度不得超过一个月哦');
            } else {
              const createDateStart = `${start} 00:00:00`;
              const createDateEnd = `${end} 23:59:59`;
              this.props.exportBill({ createDateStart, createDateEnd });
            }
          }
        },
        type: 'secondary',
      },
    ];
    return (
      <div style={{ width: '100%' }} className="packageBill">
        <ListPage
          title="结算账单"
          buttons={buttons}
          loading={loading}
          page={dayPage}
          columns={columns}
          data={dayData}
          searchParams={dayParams}
          changeSearch={(record) => {
            changeSearch({ ...record });
          }}
          search={(record) => {
            this.props.search({
              ...record,
            });
          }}
          className="dayBill"
        />
      </div>
    );
  }
}

export default View;
