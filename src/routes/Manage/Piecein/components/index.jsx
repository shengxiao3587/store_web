import React, { Component } from 'react';
import { message } from 'antd';
import DetailPage from '../../../../components/DetailPage';
import ModalForm from '../../../../components/ModalForm';
import './piecein.scss';


class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('expressCompany');
    document.getElementById('waybillNo').focus();
    props.checkSearch().then(this.props.reset);
  }
  handleSave(form) {
    form.validateFieldsAndScroll({ force: true }, (err, paramsTemp) => {
      const params = paramsTemp;
      const that = this;
      if (!err) {
        this.props.checkBlance({ bindManId:params.bindManId }).then((s) => {
          if (s) {
            if (this.props.enabled === true) {
              this.props.checkPhone({ phone: paramsTemp.receiverPhone }).then((returnData) => {
                if (that.props.areaNumType === 0) {
                  if (/^[a-zA-Z]*$/.test(params.areaNum.substring(0, params.areaNum.length - 1))) {
                    params.areaNum = `${params.areaNum}-${params.waybillNo.slice(-4)}`;
                  } else {
                    params.areaNum = `${params.areaNum.substring(0, params.areaNum.length - 1)}-` +
                      `${params.areaNum.substring(params.areaNum.length - 1)}`;
                    params.areaNum = `${params.areaNum}-${params.waybillNo.slice(-4)}`;
                  }
                }
                if (!returnData) {
                  that.props.save(params);
                }
              });
            } else {
              message.error('该合作对象账户余额不足');
            }
          }
        });
      }
    });
  }
  handlekeydown(type, e) {
    const keyCodeStatus = this.props.codeStatus;
    if ((e.keyCode === 229 || e.keyCode === 0) && keyCodeStatus === 1) {
      const params = type;
      this.props.codeStatusAdd();
      message.warning('请切换成英文输入法', 3);
      setTimeout(this.props.changeKeyCode.bind(this, params), 500);
    }
    if (e.keyCode === 13 && type === 'waybillNo') {
      document.getElementById('waybillNo').select();
    }
    if (e.keyCode === 13 && type === 'areaNum') {
      document.getElementById('areaNum').select();
    }
  }
  handleFocus = (type) => {
    if (type === 'waybillNo') {
      document.getElementById('waybillNo').select();
    }
    if (type === 'areaNum') {
      document.getElementById('areaNum').select();
    }
  }
  emitEmpty(value) {
    this.props.emitEmpty(value);
  }
  render() {
    const {
      data,
      dicts,
      loading,
      areaNumType,
      visible,
      bindData,
      handleCancel,
      fieldsTempData,
    } = this.props;
    const fields = [
      {
        label: '运单号',
        name: 'waybillNo',
        simple: true,
        required: true,
        type: 'inputOnly',
        onFocus: this.handleFocus.bind(this, 'waybillNo'),
        onKeyDown: this.handlekeydown.bind(this, 'waybillNo'),
        pattern: /^[0-9A-Za-z]{8,20}$/,
        patternMsg: '运单号为8-20位数字字母',
        emitEmpty: this.emitEmpty.bind(this, 'waybillNo'),
        value: data.waybillNo,
        placeholder: '请输入或扫描运单号',
      },
      {
        label: '快递公司',
        name: 'expressCompanyId',
        simple: true,
        required: true,
        type: 'select',
        data: dicts.expressCompany,
        render: (text, record) => record.expressCompany,
        onSelect: (value) => this.props.getBindMan({ expressCompanyId: value }),
      },
      {
        label: '合作对象',
        name: 'bindManId',
        simple: true,
        required: true,
        type: 'select',
        data: bindData,
        render: (text, record) => record.expressCompany,
        extra: '余额不足时，可以选择“其他”，线下结算',
      },
      {
        label: '取件号',
        name: 'areaNum',
        small: 16,
        type: 'inputOnly',
        onFocus: this.handleFocus.bind(this, 'areaNum'),
        onKeyDown: this.handlekeydown.bind(this, 'areaNum'),
        required: true,
        simple: true,
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
        emitEmpty: this.emitEmpty.bind(this, 'areaNum'),
        value: data.areaNum,
        placeholder: areaNumType === 0 ? '请输入或扫描架排号' : '请输入1-6位数字编号',
      },
      {
        label: '收件人电话',
        name: 'receiverPhone',
        required: true,
        simple: true,
        phone: true,
        placeholder: '请输入收件人联系电话',
      },
    ];
    const fieldsTemp = [
      { label: '标记用户', name: 'userName', simple: true, disabled: true },
      { label: '电话', name: 'phone', simple: true, disabled: true },
      { label: '备注', name: 'remark', simple: true, disabled: true },
    ];
    const buttons = [{
      label: '确认入库',
      onClick: this.handleSave.bind(this),
      loading,
    }];
    return (
      <div style={{ width: '100%' }} className="piecein">
        <h2 className="title">包裹入库</h2>
        <div className="list">
          <div className="list_tab">快捷键使用说明：使用tab键可以快速换行输入哦</div>
          <DetailPage
            fields={fields}
            buttonCenter={false}
            values={data}
            loading={loading}
            buttons={buttons}
            changeRecord={this.props.changeRecord}
          />
        </div>
        <ModalForm
          cusTitle="发现标记用户!"
          visible={visible}
          values={fieldsTempData}
          onCancel={handleCancel}
          fields={fieldsTemp}
          onCreate={handleCancel}
          formWidth={500}
          footerButton
          buttonText="我知道了"
        />
      </div>
    );
  }
}

export default View;
