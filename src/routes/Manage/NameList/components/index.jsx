import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import DetailPage from '../../../../components/DetailPage';
import './namelistCss.css';

class View extends Component {
  componentDidMount() {
    const { props } = this;
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

  handleSave(form) {
    form.validateFieldsAndScroll({ force: true }, (err, params) => {
      if (!err) {
        const param = {
          ...params,
        };
        this.props.save(param).then((flag) => {
          if (flag.success === true) {
            this.props.search({
              ...this.props.page,
              ...this.props.searchParams,
            });
          }
        });
      }
    });
  }
  handleCancel() {
    this.props.closeVisable();
  }

  del(record) {
    const { props } = this;
    props.del({
      id: record.id,
    }).then((flag) => {
      if (flag.success === true) {
        this.props.search({
          ...this.props.searchParams,
          ...this.props.page,
          pageNo: '1',
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
      modalData,
      buttonLoading,
      visible,
      modalStatus,
      loading,
      titleName,
    } = this.props;

    const columns = [
      {
        label: '',
        name: 'id',
        hidden: true,
      },
      {
        label: '用户姓名',
        name: 'userName',
        search: true,
      },
      {
        label: '联系电话',
        name: 'phone',
        search: true,
        placeholder: '请输入用户联系电话',
      },
      {
        label: '备注',
        name: 'remark',
        className: 'tableremark',
      },
      {
        label: '创建时间',
        name: 'createDate',
        render: (text) => DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm'),
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (<span>
          <Button
            type="default"
            className="nameList_button_update"
            onClick={this.handleChange.bind(this, { ...record, modalStatus: false, titleName: '编辑标记用户' })}
          >编辑</Button>
          {
            <Button
              type="danger"
              className="nameList_button_del"
              onClick={() => {
                Modal.confirm({
                  title: <span>删除后该用户将不再被标记哦</span>,
                  onOk: this.del.bind(this, record),
                  onCancel: () => {},
                });
              }}
            >删除</Button>
          }
        </span>),
      },
    ];
    const fields = [{
      label: '',
      name: 'id',
      hidden: true,
    }, {
      label: '用户姓名',
      name: 'userName',
      required: !modalStatus,
      simple: true,
      max: 10,
    }, {
      label: '联系电话',
      name: 'phone',
      phone: true,
      required: !modalStatus,
      simple: true,
      placeholder: '请输入用户联系电话',
    }, {
      label: '备注',
      name: 'remark',
      required: !modalStatus,
      simple: true,
      type: 'textarea',
      maxLength: '50',
      minRows: 3,
      className: 'remark',
      labelExtra: '50字以内的备注',
    }];

    const modalButtons = [{
      label: '取消',
      onClick: this.handleCancel.bind(this),
      type: 'default',
    }, {
      label: '提交',
      onClick: this.handleSave.bind(this),
      loading: buttonLoading,
      hidden: modalStatus,
      disabled: modalStatus,
    }];

    const children = (
      <Modal
        visible={visible}
        footer={null}
        onCancel={this.handleCancel.bind(this)}
        title={titleName}
        className="nameListModal"
      >
        <DetailPage
          fields={fields}
          values={modalData}
          buttons={modalButtons}
          changeRecord={this.props.changeRecord}
        />
      </Modal>
    );
    const parenthesisNode = (
      <div className="nameList_span"> 标记用户，默认不入库，可以选择送货上门或者电话单独通知取件 </div>
    );

    const buttons = [{
      label: '+ 新增标记用户',
      onClick: this.handleChange.bind(this, { modalStatus: false, titleName: '新增标记用户' }),
      type: 'default',
    }];
    return (
      <div style={{ width:'100%' }} className="nameList">
        <ListPage
          loading={loading}
          search={search}
          title="标记用户"
          columns={columns}
          data={data}
          buttons={buttons}
          changeSearch={changeSearch}
          page={page}
          searchParams={searchParams}
          childrenNode={children}
          parenthesisNode={parenthesisNode}
        />
      </div>
    );
  }
}

export default View;
