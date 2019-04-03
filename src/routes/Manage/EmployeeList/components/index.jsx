import React, { Component } from 'react';
import { Button, Modal, Tabs } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import './employeelist.scss';
import CommunityRider from './DoubleInput';

const TabPane = Tabs.TabPane;

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('employeeType');
    props.dict('riderStatus');
    props.search({
      ...this.props.page,
    });
    props.riderSearch({
      ...this.props.riderPage,
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }

  onchange(evt) {
    this.props.changeActiveKey(evt);
  }

  handleChange(record) {
    const { props } = this;
    props.changeVisible(record);
  }

  logOut(record) {
    const { props } = this;
    props.logout({
      id: record.id,
      delFlag: '1',
    }).then(() => {
      this.props.search({
        ...this.props.searchParams,
        ...this.props.page,
      });
    });
  }
  handleSave(record) {
    const searchParams = {
      ...this.props.searchParams,
      ...this.props.page,
    };
    return this.props.save(record).then(() => {
      this.props.search(searchParams);
    });
  }

  render() {
    const {
      data,
      search,
      activeKey,
      modalVisible,
      modalData,
      searchParams,
      page,
      dicts,
      changeRecord,
      changeSearch,
      handleCancel,
      riderData,
      riderSearch,
      riderLoading,
      riderSearchParams,
      riderButtonLoading,
      processStatus,
      riderPage,
      employeeTypeList,
    } = this.props;
    // 删除店长的label和value;
    const employeeType = dicts.employeeType || [];
    for (let i = 0; i < employeeType.length; i += 1) {
      if (employeeType[i].value === '10' || employeeType[i].value === '13') {
        employeeType.splice(i, 1);
      }
    }
    const roleType = localStorage.getItem('roleType');

    const columns = [
      {
        label: '工号',
        name: 'employeeCode',
      },
      {
        label: '员工姓名',
        name: 'name',
        search: true,
      },
      {
        label: '联系电话',
        name: 'phone',
        search: true,
        placeholder: '请输入员工联系电话',
      },
      {
        label: '职位类型',
        name: 'employeeType',
        type: 'select',
        search: true,
        data: employeeType,
        render: (text) => (employeeTypeList[text]),
      },
      {
        label: '在职状态',
        name: 'delFlag',
        type: 'select',
        search: true,
        data: [['0', '在职'], ['1', '离职']],
        render: (text, record) => {
          if (record.delFlag === '1') {
            return '离职';
          }
          return '在职';
        },
      },
      {
        label: '入职时间',
        name: 'createDate',
        render: (text) => text && DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (
          (roleType === '10' && record.delFlag === '0') ?
            (<span>
              <Button
                type="secondary"
                onClick={this.handleChange.bind(this, record)}
              >编辑</Button>
              {
                <Button
                  type="default"
                  onClick={() => {
                    Modal.confirm({
                      iconType: '',
                      title: <span>注销后该账号将不能再登录门店及兔波波助手工作台<br />确定要离职注销？</span>,
                      onOk: this.logOut.bind(this, record),
                      onCancel: () => {},
                    });
                  }}
                >离职注销</Button>
              }
            </span>) : (<span>-</span>)
        ),
      },
    ];
    const fields = [{
      label: '职位类型',
      name: 'employeeType',
      type: 'select',
      required: true,
      data: employeeType,
      simple: true,
    }, {
      label: '员工姓名',
      name: 'name',
      required: true,
      simple: true,
      max: 20,
    }, {
      label: '联系电话',
      name: 'phone',
      required: true,
      simple: true,
      phone:true,
      className: 'employeelist_modal_phone',
    }];
    const modalChildNode = (
      <div className="employeelist_modal_div">联系方式默认为登录账号，密码默认为12345678</div>
    );
    const buttons = roleType === '10' ? [{
      label: '新增员工',
      onClick: this.handleChange.bind(this, {}),
      type: 'secondary',
      className: 'specialButton',
    }] : [];
    const createButton = (btnOpts) => (
      btnOpts.map((item, index) => {
        if (!item.hidden) {
          const key = `button${index}`;
          return (
            <Button
              key={key}
              type={item.type || 'primary'}
              onClick={item.onClick.bind(this)}
              className={item.className}
            >
              {item.label}
            </Button>
          );
        }
        return false;
      })
    );
    return (
      <div style={{ width:'100%' }} className="employeeList_body">
        <Tabs onChange={this.onchange.bind(this)} style={{ width:'100%' }}>
          <TabPane tab="门店员工" key="0">
            <div style={{ width:'100%' }}>
              <ListPage
                {...this.props}
                search={search}
                columns={columns}
                data={data}
                formWidth={600}
                fields={fields}
                name={'员工'}
                modalVisible={modalVisible}
                changeSearch={(record) => {
                  changeSearch({ ...record, type: 0 });
                }}
                record={modalData}
                page={page}
                save={this.handleSave.bind(this)}
                cancel={handleCancel}
                searchParams={searchParams}
                changeRecord={changeRecord}
                modalChildNode={modalChildNode}
                className="employeelist"
              />
            </div>
          </TabPane>
          <TabPane tab="社区骑手" key="1">
            <CommunityRider
              data={riderData}
              dicts={dicts}
              search={riderSearch}
              loading={riderLoading}
              searchParams={riderSearchParams}
              changeSearch={(record) => {
                changeSearch({ ...record, type: 1 });
              }}
              audit={this.props.audit}
              riderButtonLoading={riderButtonLoading}
              processStatus={processStatus}
              page={riderPage}
              className="communityRider"
            />
          </TabPane>
        </Tabs>
        { activeKey === '0' && createButton(buttons)}
      </div>
    );
  }
}

export default View;
