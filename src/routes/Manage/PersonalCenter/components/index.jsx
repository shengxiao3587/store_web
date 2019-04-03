import React, { Component } from 'react';
import { message, Button, Modal, Icon } from 'antd';
import { CompareUtil } from '@xinguang/common-tool';
import DetailPage from '../../../../components/DetailPage';
import './brcss.scss';
import addr from '../../../../../public/mock/addr2.json';
import dictionaries from '../../../../../public/mock/dictionaries.json';

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('allExpressCompany');
    props.dict('storeBusiness');
    props.search();
  }
  componentWillUnmount() {
    this.props.reset();
  }

  cascaderChange(value) {
    setTimeout(() => {
      this.props.resetInput(value);
    }, 100);
  }

  handleSave(form) {
    form.validateFieldsAndScroll({ force: true }, (err, paramsTemp) => {
      if (!err) {
        const params = {
          ...paramsTemp,
          longitude: paramsTemp.amap.lngLat && paramsTemp.amap.lngLat[0],
          latitude: paramsTemp.amap.lngLat && paramsTemp.amap.lngLat[1],
          picUrlLicense: paramsTemp.picUrlLicense && paramsTemp.picUrlLicense[0] && paramsTemp.picUrlLicense[0].url,
          picUrlOne: paramsTemp.picUrlOne && paramsTemp.picUrlOne[0] && paramsTemp.picUrlOne[0].url,
          picUrlStore: paramsTemp.picUrlStore && paramsTemp.picUrlStore[0] && paramsTemp.picUrlStore[0].url,
          province: paramsTemp.storeDistrict[0],
          city: paramsTemp.storeDistrict[1],
          district: paramsTemp.storeDistrict[2],
          serviceTimeEnd: paramsTemp.serviceTime.serviceTimeEnd.value.format('HH:mm'),
          serviceTimeStart: paramsTemp.serviceTime.serviceTimeStart.value.format('HH:mm'),
        };
        delete params.amap;
        delete params.storeDistrict;
        delete params.serviceTime;
        delete params.distributionDetails_div;
        // 不需要校验重复的字段
        const list = [
          'delFlag',
          'cityCode',
          'provinceCode',
          'districtCode',
          'expressCompanyList',
          'createDate',
          'updateDate',
          'returnInfoStatus',
          'failReasonflag',
          'returnApplyReason',
          'returnFailureReason',
          'storeServiceTime',
          'workFlowId',
          'longitude',
          'latitude',
        ];
        if (CompareUtil.compare2Objects(params, this.props.compareData, list).length > 0) {
          this.props.save(params).then((e) => {
            if (e) {
              this.props.search();
            }
          });
        } else {
          message.warning('信息没有变更');
          this.props.status();
        }
      }
    });
  }

  updateStatus() {
    this.props.updateStatus();
  }

  beforeUpload = (file) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
      return true;
    }
    message.error('上传的文件格式不对');
    return false;
  }

  updateVisible(record) {
    this.props.updateVisible(record);
  }

  exit(form) {
    form.validateFieldsAndScroll({ force: true }, (err, paramsTemp) => {
      if (!err) {
        const params = {
          ...paramsTemp,
          type: 'STORE_QUIT',
          storeId: '123',
        };
        this.props.exit(params).then((success) => {
          if (success) {
            this.props.search();
          }
        });
      }
    });
  }

  exitNodeCancel = () => {
    this.props.exitNodeCancel().then((success) => {
      if (success) {
        this.props.search();
      }
    });
  }
  // 复用样式
  exitNode = (className, icon, returnInfoStatus) => (<div className={className || ''}>
    <p className="personCenter_notice_title">
      <span>退出加盟</span>
      <span className="notice_span">*退出加盟后，您将与兔波波解除合作关系！</span>
      {
        icon && returnInfoStatus === 'FAIL' && <Icon type="close" onClick={this.exitNodeCancel} />
      }
    </p>
    <div className="personCenter_notice">
      <div className="notice_div">
        <p className="notice_title">退出须知：</p>
        <p className="notice_detail">
          <span>退出申请前请保证处理完在库快递，即所有快递需完成签收。</span>
          <br />
          <span>退出申请提交后，将需要一段时间进行审核，审核期暂不可用入库功能。</span>
          <br />
          <span>退出成功后将收到短信通知，系统不可用，入驻保证金将在退出成功后线下打款。</span>
        </p>
      </div>
      {
        icon && (returnInfoStatus === 'INIT'
          ? <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/audit%403x.png" alt="tubobo-2" />
          : <img
            src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/audit_failure%403x.png"
            alt="tubobo-1"
          />)
      }
    </div>
  </div>);
  render() {
    const {
      data,
      loading,
      inputData,
      buttonLoading,
      editStatus,
      modalVisible,
      modalData,
    } = this.props;
    const {
      wealPolicy,
    } = data;
    const fields = [
      {
        label: 'storeStatus',
        name: 'storeStatus',
        disabled: true,
        hidden: true,
      },
      {
        label: 'storeInfoStatus',
        name: 'storeInfoStatus',
        disabled: true,
        hidden: true,
      },
      {
        label: 'storeId',
        name: 'storeId',
        disabled: true,
        hidden: true,
      },
      {
        label: '门店信息',
        name: 'title',
        type: 'title',
        className: 'detailPage',
      },
      {
        label: '门店ID',
        name: 'storeCode',
        disabled: true,
        small: 8,
        colon: false,
        className: 'smaller',
      },
      {
        label: '门店名称',
        name: 'storeName',
        disabled: editStatus,
        required: !editStatus,
        small: 8,
        max: 20,
        colon: false,
        className: 'smaller',
      },
      {
        label: '门店类型',
        name: 'storeType',
        disabled: editStatus,
        required: !editStatus,
        small: 8,
        type: 'select',
        data: dictionaries.storeType,
        colon: false,
        className: 'smaller-1',
      },
      {
        label: '经营业务',
        name: 'storeBusiness',
        disabled: editStatus,
        required: !editStatus,
        small: 8,
        type: 'select',
        data: this.props.dicts.storeBusiness,
        colon: false,
        className: 'smaller',
      },
      {
        label: '门店面积(㎡)',
        name: 'storeArea',
        disabled: editStatus,
        required: !editStatus,
        small: 8,
        colon: false,
        pattern:/^((\d{1,3})|(\d{1,3}\.\d{1,2}))$/,
        patternMsg: '请输入不大于999.99的正数，可保留两位小数',
        className: 'smaller',
      },
      {
        label: '门店来源',
        name: 'storeSource',
        disabled: editStatus,
        required: !editStatus,
        small: 8,
        colon: false,
        type: 'select',
        data: dictionaries.storeSource,
        className: 'smaller-1',
      },
      {
        label: '快递公司',
        name: 'expressCompanyIdList',
        disabled: editStatus,
        required: !editStatus,
        small:16,
        colon: false,
        type: 'select',
        multiple: true,
        data: this.props.dicts.allExpressCompany,
        layoutData: {
          labelCol: { span: 4 },
        },
        className: 'smaller',
      },
      {
        label: '营业时间',
        name: 'serviceTime',
        disabled: editStatus,
        required: !editStatus,
        format: 'HH:mm',
        small: 8,
        colon: false,
        type: 'doubleTime',
        className: 'smaller-1',
      },
      {
        label: '门店地址',
        name: 'storeDistrict',
        disabled: editStatus,
        required: !editStatus,
        small: 9,
        colon: false,
        type: 'cascader',
        data: addr,
        onChange: this.cascaderChange.bind(this),
        className: 'smaller',
        layoutData: {
          labelCol: { span: 7 },
        },
      },
      {
        label: '',
        name: 'storeAddressDetail',
        disabled: editStatus,
        required: !editStatus,
        small: 15,
        colon: false,
        dataSource: inputData,
        className: 'smaller-1',
        layoutData: {
          labelCol: { span: 1 },
        },
      },
      {
        label: '',
        name: 'amap',
        disabled: editStatus,
        type: 'amap',
        inputDatasource: this.props.inputDatasource,
        city: data.storeDistrict,
        colon: false,
        width: '100%',
        height: '200px',
        image: true,
        className: 'formAmap',
      },
      {
        label: '上传门店照片',
        picture: 'picture-card',
        name: 'picUrlStore',
        type: 'AntdUpload',
        picName: '门店照片',
        disabled: editStatus,
        required: !editStatus,
        beforeUpload: this.beforeUpload,
        className: 'personCenter_div_picture',
        small: 8,
        colon: false,
        multiple: true,
        data: {
          bucketType: 'private',
          projectName: 'serviceProvider',
          token: localStorage.getItem('accessToken'),
        },
      },
      {
        label: '上传营业执照',
        name: 'picUrlLicense',
        picture: 'picture-card',
        small: 8,
        type: 'AntdUpload',
        picName: '营业执照',
        colon: false,
        beforeUpload: this.beforeUpload,
        disabled: editStatus,
        required: !editStatus,
        className: 'personCenter_div_picture',
        multiple: true,
        data: {
          bucketType: 'private',
          projectName: 'serviceProvider',
          token: localStorage.getItem('accessToken'),
        },
      },
      {
        label: '上传末端网店证',
        name: 'picUrlOne',
        picture: 'picture-card',
        small: 8,
        type: 'AntdUpload',
        picName: '末端网店证',
        colon: false,
        beforeUpload: this.beforeUpload,
        disabled: editStatus,
        className: 'personCenter_div_picture',
        multiple: true,
        data: {
          bucketType: 'private',
          projectName: 'serviceProvider',
          token: localStorage.getItem('accessToken'),
        },
      },
      {
        label: '',
        name: 'distributionDetails_div',
        long: true,
        type: 'div',
        disabled: true,
        className: 'distributionDetails_div',
      },
      {
        label: '门店负责人信息',
        name: 'title2',
        type: 'title',
        className: 'detailPage',
      },
      {
        label: '联系人',
        name: 'storeManageName',
        disabled: true,
        colon: false,
        required: !editStatus,
        max: 20,
        className: 'smaller',
      },
      {
        label: '联系电话',
        name: 'storePhone',
        disabled: true,
        colon: false,
        className: 'smaller-1',
      },
      {
        label: '客服电话',
        name: 'telephone',
        disabled: editStatus,
        required: !editStatus,
        colon: false,
        max: 30,
        className: 'smaller',
      },
      {
        label: '银行卡号',
        name: 'alipayAccount',
        disabled: true,
        colon: false,
        className: 'smaller-1',
      },
    ];
    const modalFields = [
      {
        label: '退出申请',
        name: 'reason',
        simple: true,
        colon: false,
        type: 'textarea',
        minRows: 6,
        placeholder: '请填写退出加盟的原因',
        required: true,
        max: 50,
      },
    ];
    let storeInfoStatusHide = '';
    if (data.storeInfoStatus === 'INIT') {
      storeInfoStatusHide = 'block';
    } else {
      storeInfoStatusHide = 'none';
    }
    const buttons = [{
      label: '提交变更信息',
      onClick: this.handleSave.bind(this),
      hidden: editStatus,
      loading: buttonLoading,
      type: 'secondary',
      style: { background: '#ffd800', border: 'none' },
    }];
    const modalButtons = [{
      label: '确认',
      onClick: this.exit.bind(this),
      loading: buttonLoading,
      type: 'secondary',
    }];
    return (
      <div className="personCenter_new">
        {
          wealPolicy && wealPolicy.content &&
          <header>
            <div className="personCenter_title">
              用户补贴 <span>{`有效期：${wealPolicy.timeStart} ~ ${wealPolicy.timeEnd}`}</span>
            </div>
            <div className="personCenter_content">
              {wealPolicy.content}
            </div>
          </header>
        }
        <div style={{ width: '100%', padding: '16px' }} className="personCenter">
          <Modal
            visible={modalVisible}
            footer={null}
            onCancel={this.updateVisible.bind(this, { modalVisible: false })}
            className="personCenter_exit"
            width="800px"
          >
            <div>
              {
                this.exitNode('', false)
              }
              <DetailPage
                fields={modalFields}
                values={modalData}
                loading={loading}
                buttons={modalButtons}
              />
            </div>
          </Modal>
          <div className="personCenter_div">
            <div>
              <span className="personCenter_span1">基本信息</span>
              {
                storeInfoStatusHide === 'block' ? <span className="personCenter_h3">变更信息审核中</span> : null
              }
            </div>
            <div>
              <Button
                onClick={this.updateStatus.bind(this)}
                hidden={
                  (data.returnInfoStatus !== 'FAIL' && data.returnInfoStatus !== '')
                  || editStatus === false
                  || data.storeInfoStatus === 'INIT'}
                type="secondary"
                className="personCenter_button_update"
              >变更信息</Button>
              <Button
                onClick={this.updateVisible.bind(this, { modalVisible: true })}
                hidden={data.returnInfoStatus === 'INIT' || editStatus === false}
                type="default"
                className="personCenter_button_update"
              >退出加盟</Button>
            </div>
          </div>
          {
            data.failReasonflag && this.exitNode('personCenter_exit_detail', true, data.returnInfoStatus)
          }
          {
            data.failReasonflag && <div className="personCenter_exit_detail exit_detail_apply">
              <hr />
              <div className="notice_div">
                <p className="notice_title">退出申请：</p>
                <p className="notice_detail">
                  <span>{ data.returnApplyReason || '-'}</span>
                </p>
              </div>
            </div>
          }
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
