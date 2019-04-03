import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('queryStatus');
    props.dict('tucaibaoType');
    props.search({
      ...props.searchParams,
      pageSize: '10',
      pageNo: '1',
    });
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  handleChange(record) {
    const { props } = this;
    props.changeVisible(record);
  }
  ops(params) {
    this.props.ops(params).then((isSuccess) => {
      if (isSuccess) {
        this.props.search({
          ...this.props.searchParams,
          ...this.props.page,
        });
      }
    });
  }

  render() {
    const {
      data,
      search,
      searchParams,
      page,
      changeSearch,
      loading,
      buttonloading,
      dicts,
    } = this.props;

    const columns = [
      {
        label: '合同编号',
        name: 'uniqueKey',
      },
      {
        label: '合作对象',
        name: 'name',
        search: true,
        render: (text, record) => (
          <div>
            <p>{record.name}</p>
            <p>{record.phone}</p>
          </div>
        ),
      },
      {
        label: '联系方式',
        name: 'phone',
        search: true,
        hidden: true,
      },
      {
        label: '类型',
        name: 'bindType',
        render: (text) => {
          if (!text) {
            return <span>-</span>;
          }
          const list = [];
          dicts.tucaibaoType && dicts.tucaibaoType.forEach((item) => {
            if (item.value === text) {
              list.push(item);
            }
          });
          if (list.length > 0) {
            return <span>{list[0].label}</span>;
          }
          return <span>-</span>;
        },
      },
      {
        label: '所属快递',
        name: 'expressCompany',
      },
      {
        label: '所属城市',
        name: 'city',
      },
      {
        label: '寄存价格（元）',
        name: 'consignationPrice',
        render: (text) => (<span>{text / 100}</span>),
      },
      {
        label: '合同状态',
        name: 'protocolStatus',
        search: true,
        type: 'select',
        data: dicts.queryStatus,
        render: (text) => {
          if (!text) {
            return <span>-</span>;
          }
          const list = [];
          dicts.queryStatus && dicts.queryStatus.forEach((item) => {
            if (item.value === text) {
              list.push(item);
            }
          });
          if (list.length > 0) {
            return <span>{list[0].label}</span>;
          }
          return <span>-</span>;
        },
      },
      {
        label: '生效期限(年)',
        name: 'effectDate',
      },
      {
        label: '发起时间',
        required: true,
        name: 'createDate',
        search: true,
        type: 'twodateRange',
        render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
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
        label: '生效时间',
        name: 'protocolStartDate',
        render: (text) => (text ? DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm') : '-'),
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (<span>
          {
            record.protocolStatus !== '2' && record.protocolStatus !== '1' && <span>-</span>
          }
          {
            record.protocolStatus === '2' && <Button
              type="default"
              className="nameList_button_del"
              loading={buttonloading}
              onClick={() => {
                Modal.confirm({
                  title: <span>提前解约后，将与该合作对象终止合作，<br />确定要继续该操作吗？</span>,
                  onOk: this.ops.bind(this, {
                    id: record.id,
                    ops: '0',
                    decision: '0',
                  }),
                  onCancel: () => {},
                });
              }}
            >提前解约</Button>
          }
          {
            record.protocolStatus === '1' && <span>
              <Button
                type="secondary"
                className="nameList_button_del"
                loading={buttonloading}
                onClick={() => {
                  Modal.confirm({
                    title: <span>接受操作后，将与该合作对象达成合作关系，<br />确定要继续该操作吗？</span>,
                    onOk: this.ops.bind(this, {
                      id: record.id,
                      ops: '1',
                      decision: '1',
                    }),
                    onCancel: () => {},
                  });
                }}
              >接受</Button>
              <Button
                type="default"
                className="nameList_button_del"
                loading={buttonloading}
                onClick={() => {
                  Modal.confirm({
                    title: <span>拒绝操作后，该合作对象需要重新发起审核，<br />确定要继续该操作吗？</span>,
                    onOk: this.ops.bind(this, {
                      id: record.id,
                      ops: '1',
                      decision: '0',
                    }),
                    onCancel: () => {},
                  });
                }}
              >拒绝</Button>
            </span>
          }
        </span>),
      },
    ];
    return (
      <div style={{ width:'100%' }} >
        <ListPage
          loading={loading}
          search={search}
          title="合作伙伴"
          columns={columns}
          data={data}
          changeSearch={changeSearch}
          page={page}
          searchParams={searchParams}
        />
      </div>
    );
  }
}

export default View;
