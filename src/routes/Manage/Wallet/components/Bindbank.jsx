/**
 * Created by xiaolb on 2017/12/14.
 */
import React, { Component } from 'react';
import ModalForm from '../../../../components/ModalForm';

export default class Bindbank extends Component {
  save() {
    const {
      record,
      bindBankSave,
      search,
      bankdetail,
    } = this.props;
    // 绑定银行卡
    bindBankSave(record).then((isSuccess) => {
      isSuccess && search();
      isSuccess && bankdetail();
    });
  }
  render() {
    const {
      visibleData,
      record,
      errorExplain,
    } = this.props;
    // 绑定银行卡
    const bindBankfields = [
      {
        type: 'title',
        label: <span>{ errorExplain }</span>,
        key:'explain',
        className: 'newsError',
        hidden: !errorExplain,
      }, {
        type: 'title',
        key:'takeout',
        label: <span>请填写真实有效的信息，便于提现</span>,
        className: 'newsBackgroundColor',
      }, {
        label: '真实姓名',
        name: 'name',
        simple: true,
        disabled: true,
        required: true,
      },
      {
        label: '身份证号',
        name: 'idCard',
        simple: true,
        required: true,
        long: true,
        ID: true,
      },
      {
        label: '所属银行',
        name: 'belongBankId',
        simple: true,
        required: true,
        type: 'select',
        long: true,
        data: this.props.dicts.bankType,
      },
      {
        label: '银行卡号',
        name: 'bankNum',
        simple: true,
        required: true,
        long: true,
        extra: '*请绑定门店负责人本人的银行卡，仅限储蓄卡',
      },
    ];
    return (
      <ModalForm
        {...this.props}
        visible={visibleData.visibleBank}
        fields={bindBankfields}
        formWidth={800}
        cusTitle="添加银行卡"
        onCreate={this.save.bind(this)}
        values={record}
      />
    );
  }
}
