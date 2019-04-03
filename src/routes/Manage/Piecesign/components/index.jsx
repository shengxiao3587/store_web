import React, { Component } from 'react';
import { message } from 'antd';
import DetailPage from '../../../../components/DetailPage';
import './piecesign.scss';

class View extends Component {
  componentDidMount() {
    this.props.reset();
    document.getElementById('waybillNo').focus();
  }

  handleSave(form) {
    form.validateFieldsAndScroll({ force: true }, (err, params) => {
      if (!err) {
        this.props.save(params);
      }
    });
  }

  handlekeydown(type, e) {
    const keyCodeStatus = this.props.codeStatus;
    if (e.keyCode === 229 && keyCodeStatus === 1) {
      const params = type;
      this.props.codeStatusAdd();
      message.warning('请切换成英文输入法', 3);
      setTimeout(this.props.changeKeyCode.bind(this, params), 100);
    }
    if (e.keyCode === 13 && type === 'waybillNo') {
      document.getElementById('waybillNo').select();
      if (e.key === 'Enter') {
        this.props.save({ waybillNo: e.currentTarget.defaultValue });
      }
    }
  }

  emitEmpty(value) {
    this.props.emitEmpty(value);
  }

  handleFocus = (type) => {
    if (type === 'waybillNo') {
      document.getElementById('waybillNo').select();
    }
  }

  render() {
    const {
      data,
      loading,
    } = this.props;
    const fields = [
      {
        label: '运单号',
        required:true,
        name: 'waybillNo',
        type: 'inputOnly',
        onFocus: this.handleFocus.bind(this, 'waybillNo'),
        onKeyDown: this.handlekeydown.bind(this, 'waybillNo'),
        autoComplete: false,
        simple: true,
        pattern: /^[0-9A-Za-z]{8,20}$/,
        patternMsg: '运单号为8-20位数字字母',
        placeholder: '请输入或扫描运单号',
        emitEmpty: this.emitEmpty.bind(this, 'waybillNo'),
        value: data.waybillNo,
      },
    ];
    const buttons = [{
      label: '确认签收',
      onClick: this.handleSave.bind(this),
      loading,
    }];
    return (
      <div style={{ width: '100%' }} className="pieceout piecein">
        <p className="title">包裹签收</p>
        <div className="list">
          <DetailPage
            fields={fields}
            values={data}
            loading={loading}
            buttons={buttons}
            changeRecord={this.props.changeRecord}
          />
        </div>
      </div>
    );
  }
}

export default View;
