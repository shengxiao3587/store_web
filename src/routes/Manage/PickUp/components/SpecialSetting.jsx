import React, { Component } from 'react';
import { Spin, Radio, Modal } from 'antd';
import ModalForm from '../../../../components/ModalForm';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class SpecialSetting extends Component {
  handleChange(setData, evt) {
    const {
      hasModal,
      processStatus,
      modalShow,
      detailStoreStatus,
      orderChange,
      checkSearch,
    } = this.props;
    const value = evt.target.value;
    let title;
    const {
      type,
      flag,
      reminderData,
    } = setData;

    if (hasModal) {
      modalShow(value);
      // 获取审核详情
      (processStatus === 1 || processStatus === 2) && detailStoreStatus();
      return;
    }
    if (value === 0) {
      title = (<span>
        {reminderData.open.split('<br />')[0]}
        <br />
        {reminderData.open.split('<br />')[1]}
      </span>);
    } else {
      title = (<span>
        {reminderData.close.split('<br />')[0]}
        <br />
        {reminderData.close.split('<br />')[1]}
      </span>);
    }
    Modal.confirm({
      title,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        orderChange({
          [type]: value === 0 ? 'open' : 'close',
          flag,
        }).then(() => {
          checkSearch();
        });
      },
      onCancel: () => {},
    });
  }

  save(values) {
    const {
      save,
      applyAgain,
      applyStatus,
      searchStoreStatus,
      processStatus,
    } = this.props;
    if (processStatus === 2) {
      applyAgain();
    } else if (processStatus === 0) {
      save({
        ...values,
        // 这个字段无用，只是为了和服务商的接口保持一致
        storeId: 'storevalidate',
        type: applyStatus ? 'STORE_CLOSE' : 'STORE_OPEN',
      }).then((isSuccess) => {
        isSuccess && searchStoreStatus();
      });
    }
  }

  render() {
    const {
      loading,
      setData,
      setType,
      processStatus,
      cancel,
      record,
      fields,
      modalVisible,
      confirmLoading,
      hasModal,
      hasFooter,
    } = this.props;
    const {
      picData,
      modalData,
      stateData,
      titleData,
    } = setData;
    let openStatue = picData[0];
    let closeStatue = picData[2];
    let processStatusStore;
    // processStatus 0：CLOSE:1：INFO:2：FAILURE
    if (processStatus === 1) {
      openStatue = picData[4];
      closeStatue = picData[4];
      processStatusStore = '*审核中';
    } else if (processStatus === 2) {
      openStatue = picData[5];
      closeStatue = picData[5];
      processStatusStore = '*审核失败';
    }
    return (<div className="pickup_child">
      <span className="pickup_h3">{ setData.title }</span>
      <Spin spinning={loading}>
        <div className="downStyle">
          <RadioGroup
            size="large"
            onChange={this.handleChange.bind(this, setData)}
            value={setType}
          >
            <RadioButton value={0}>
              <div
                className="pickup_radio"
              >
                {setType === 0 ?
                  <div
                    className="pic"
                    style={{
                      backgroundImage: `url(${picData[1]})`,
                      backgroundSize: 'contain',
                    }}
                  />
                  : <div
                    className="pic"
                    style={{
                      backgroundImage: `url(${openStatue})`,
                      backgroundSize: 'contain',
                    }}
                  />
                }
                <div className="pickup_radio_h2">
                  { titleData[0] }
                </div>
              </div>
            </RadioButton>
            <RadioButton value={1}>
              <div
                className="pickup_radio"
              >
                {setType === 1 ?
                  <div
                    className="picy"
                    style={{
                      backgroundImage: `url(${picData[3]})`,
                      backgroundSize: 'contain',
                    }}
                  />
                  : <div
                    className="picy"
                    style={{
                      backgroundImage: `url(${closeStatue})`,
                      backgroundSize: 'contain',
                    }}
                  />
                }
                <div className="pickup_radio_h2">
                  { titleData[1] }
                </div>
              </div>
            </RadioButton>
          </RadioGroup>
        </div>
        <div className="pickup_instructions">
          <p>
            { stateData[0] }
          </p>
          <p>
            { stateData[1] }
          </p>
          <p>
            { stateData[2] }
          </p>
        </div>
      </Spin>
      { hasModal &&
        <ModalForm
          className="processPic"
          footerButton={modalData.footerButton}
          buttonText={processStatus === 2 ? modalData.buttonText : '确认'}
          visible={modalVisible}
          onCancel={() => cancel()}
          confirmLoading={confirmLoading}
          onCreate={this.save.bind(this)}
          title={name}
          cusTitle={<sapn>
            {modalData.cusTitle}
            <a className="processStatus">{processStatusStore}</a>
          </sapn>}
          values={record}
          fields={fields}
          formWidth={600}
          hasFooter={hasFooter}
        />
      }
    </div>);
  }
}
