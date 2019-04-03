import React, { Component } from 'react';
import { Button, message, Modal, Dropdown, Menu } from 'antd';
import moment from 'moment';
import ListPage from '../../../../components/ListPage';
import './index.scss';

const confirm = Modal.confirm;

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('expressCompany').then(() => {
      props.dict('waybillStatus');
    });
    props.search(props.startSearchParams);
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  handleSign(params) {
    const { props } = this;
    confirm({
      content: '是否确认签收？',
      onOk: () => {
        props.sign({
          waybillNo: params.waybillNo,
        }).then(() => {
          props.search({
            ...props.searchParams,
            ...props.page,
          });
        });
      },
      onCancel() {},
    });
  }
  menuClick(record, e) {
    const { props } = this;
    if (e.key === '1') {
      // 获取记录详情
      props.editRecord(record).then((resultData) => {
        resultData.success &&
        props.getBindMan({
          expressCompanyId: resultData.data.expressCompany,
          editFlag: 'editFlag',
        });
      });
    }
    // 根据key来判断是编辑功能还是退回功能
    props.modalShow(e.key, record.waybillNo);
  }
  handleSave() {
    const { keys } = this.props;
    if (keys === '1') {
      if (this.props.recordEdit.oldBindManId !== this.props.recordEdit.bindManId) {
        this.props.checkBlance({ bindManId:this.props.recordEdit.bindManId }).then((s) => {
          if (s) {
            if (this.props.enabled === true) {
              this.props.save(this.props.recordEdit).then((ss) => {
                ss && this.props.search(this.props.searchParams);
              });
            } else {
              message.error('当前合作对象账户余额不足');
            }
          }
        });
      } else {
        this.props.save(this.props.recordEdit).then((ss) => {
          ss && this.props.search(this.props.searchParams);
        });
      }
    } else {
      this.props.save(this.props.recordReturn).then((ss) => {
        ss && this.props.search(this.props.searchParams);
      });
    }
  }

  render() {
    const {
      sendNote,
      searchParams,
      search,
      // 合作对象数据
      bindData,
      dicts,
      waybillStatusData,
      returnReasonData,
      // 根据keys来判断是编辑功能还是退出功能, 1为编辑，2为退回
      keys,
      recordReturn,
      recordEdit,
      areaNumType,
    } = this.props;
    const columns = [
      {
        label: '运单号',
        name: 'waybillNo',
        search: true,
        width: 228,
        render: (text, record) => {
          const { waybillNo, expressCompanyId } = record;
          return (
            <div style={{ float: 'left', paddingLeft: '36px' }}>
              <span
                style={{
                  background: '#198AF0',
                  color: 'white',
                  padding: '3px',
                  marginRight: '6px',
                  borderRadius: '4px',
                }}
              >{ expressCompanyId }</span>
              <a
                target="_blank"
                role="button"
                style={{ color: '#198AF0', fontWeight: 'bold' }}
                tabIndex={0}
                href={`/Manage/ExpressageDetail/${waybillNo}`}
              >
                { waybillNo }
              </a>
            </div>
          );
        },
      },
      {
        label: '快递公司',
        name: 'expressCompanyId',
        type: 'select',
        data: dicts.expressCompany,
        search: true,
        hidden: true,
      },
      {
        label: '运单状态',
        name: 'waybillStatus',
        type: 'select',
        data: dicts.waybillStatus,
        search: true,
        render: (text, record) => {
          const { waybillStatus, updateTime } = record;
          return (
            <div>
              <span>
                { waybillStatusData[waybillStatus] }
              </span>
              <span> ({ updateTime })</span>
            </div>
          );
        },
      },
      {
        label: '取件号',
        name: 'areaNum',
        search: true,
      },
      {
        label: '联系电话',
        name: 'receiverPhone',
        search: true,
        placeholder: '请输入收件人联系电话',
      },
      {
        label: '在库时长(天)',
        name: 'remainDay',
        type: 'select',
        search: true,
        data: this.props.remainDayData,
      },
      {
        label: '合作对象',
        name: 'bindMan',
        search: true,
      },
      {
        label: '时间',
        name: 'update',
        search: true,
        type: 'twodateRange',
        hidden: true,
        required: true,
        validator: (rule, values, callback) => {
          if ((values.startValue || values[0]) && (values.endValue || values[1])) {
            callback();
          }
          if (!values.startValue && !values[0]) {
            callback('请输入开始时间');
          }
          if (!values.endValue && !values[1]) {
            callback('请输入结束时间');
          }
        },
      },
      {
        label: '操作',
        name: 'action',
        width: 260,
        render: (text, record) => {
          const menu = (
            <Menu onClick={this.menuClick.bind(this, record)}>
              <Menu.Item key="1">编辑</Menu.Item>
              <Menu.Item key="2">退回</Menu.Item>
            </Menu>
          );
          return (<span>
            {
              (record.waybillStatus === 1 && record.pickupType === '0') ?
                <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                  <Button
                    type="secondary"
                    onClick={
                      this.handleSign.bind(this, record)
                    }
                  >签收</Button>
                  <Button
                    type="default"
                    onClick={
                      () => {
                        sendNote({
                          waybillNo: record.waybillNo,
                        }, 'unique');
                      }
                    }
                  >发送短信</Button>
                  <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    getPopupContainer={(node) => document.getElementsByClassName('ant-layout-content')[0] || node}
                  >
                    <Button>
                      更多
                    </Button>
                  </Dropdown>
                </div> :
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>-</span>
            }
          </span>);
        },
      },
    ];
    const formFields = [
      {
        label: '快递公司',
        name: 'expressCompanyId',
        simple: true,
        required: true,
        type: 'select',
        long: true,
        hidden: keys === '2',
        data: dicts.expressCompany,
        onSelect: (value) => this.props.getBindMan({ expressCompanyId: value }),
      },
      {
        label: '合作对象',
        name: 'bindManId',
        simple: true,
        required: true,
        type: 'select',
        long: true,
        hidden: keys === '2',
        data: bindData,
      },
      {
        label: '收件人',
        name: 'receiverPhone',
        simple: true,
        required: true,
        hidden: keys === '2',
        long: true,
        phone: true,
      },
      {
        label: '取件号',
        name: 'areaNum',
        simple: true,
        required: true,
        long: true,
        hidden: keys === '2',
        validator: (rule, value, callback) => {
          if (value && /^0/.test(value)) {
            callback('取件号不能以0开头');
          }
          if (value && areaNumType === 0 && !/^[1-9A-Za-z][0-9]{1,2}$/.test(value)) {
            callback('支持首位数字或字母，其他为数字，可输入2-3位');
          }
          if (value && areaNumType === 1 && !/^[1-9][0-9]{0,5}$/.test(value)) {
            callback('请输入1-6位数字编号');
          }
          callback();
        },
      },
      {
        label: '原因',
        name: 'returnReason',
        simple: true,
        required: true,
        type: 'select',
        long: true,
        hidden: keys === '1',
        data: returnReasonData,
      },
      {
        label: '备注',
        name: 'remark',
        long: true,
        simple: true,
        max: 10,
        hidden: keys === '1',
        type: 'textarea',
      },
    ];
    const buttons = [
      {
        label: '全部导出',
        onClick: () => {
          const value = searchParams.update.value;
          if (value[0] === null || value[1] === null) {
            message.error('请选择时间');
          } else {
            const start = moment(value[0]).format('YYYY-MM-DD');
            const end = moment(value[1]).format('YYYY-MM-DD');
            if (moment(start).add(1, 'months').subtract(1, 'days').isBefore(moment(end))) {
              message.error('导出时间跨度不得超过一个月哦');
            } else {
              const updateStart = `${start} 00:00:00`;
              const updateEnd = `${end} 23:59:59`;
              this.props.exportExpressage({ updateStart, updateEnd });
            }
          }
        },
        type: 'secondary',
      },
      {
        label: '批量发短信',
        onClick: () => {
          if (searchParams.remainDay && searchParams.remainDay.value) {
            const params = {
              ...searchParams,
              waybillStatus: 1,
            };
            sendNote(params, 'all');
          } else {
            message.warn('请选择发送短信的在库时长', 3);
          }
        },
        type: 'default',
      },
    ];

    return (
      <div className="expressage">
        <ListPage
          {...this.props}
          search={search}
          title="包裹查询"
          columns={columns}
          buttons={buttons}
          formWidth={600}
          cusTitle={keys === '1' ? '编辑' : '退回原因'}
          fields={formFields}
          record={keys === '1' ? recordEdit : recordReturn}
          save={() => { this.handleSave(); }}
        />
      </div>
    );
  }
}

export default View;
