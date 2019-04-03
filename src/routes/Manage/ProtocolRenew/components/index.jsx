/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { Steps, Button, Modal } from 'antd';
import { browserHistory } from 'react-router';
import Protocol from './protocol';

const Step = Steps.Step;

class View extends Component {
  componentWillMount() {
    this.props.getStatus();
  }
  handleChange() {
    this.props.changeChecked();
  }
  showProtocol() {
    this.props.showProtocol();
  }
  handleCancel() {
    this.props.closeProtocol();
  }
  disPay() {
    this.props.disPay();
  }
  nextStepPay(param) {
    const params = {
      ...param,
      step: this.props.stepNum,
      flag: 'continue',
      url: `${window.location.protocol}//${window.location.host}/Manage/HomePage`,
    };
    this.props.nextStepPay(params).then((success) => {
      if (success) {
        document.getElementsByTagName('form')[0].submit();
      }
    });
  }
  createFrom = () => ({ __html: this.props.htmlCode });
  create = () => (<div dangerouslySetInnerHTML={this.createFrom()} />);
  render() {
    const {
      checked,
      checkboxStatus,
      stepStatus = 'in',
      stepNum = 1,
      protocolVisible,
      loading,
      htmlCode,
      money = '0.00',
      effectTime,
      payee = '浙江极配科技有限公司',
      wealPolicyContent,
    } = this.props;
    return (
      <div className="protocolSteps">
        <Modal
          visible={protocolVisible}
          footer={null}
          width="600px"
          onCancel={this.handleCancel.bind(this)}
          className="protocolStepsModel"
        >
          <div className="shop-protocol-title">
            <span>
              《兔波波门店合作协议》
            </span>
          </div>
          <Protocol
            height="410px"
            alipayAccount=""
            checked={checked}
            checkboxStatus={checkboxStatus}
            wealPolicyContent={wealPolicyContent}
          />
          <div className="shop-protocol-button">
            <Button type="primary" onClick={this.handleCancel.bind(this)}>关闭</Button>
          </div>
        </Modal>
        <span className="protocolSteps_h2">
          续签缴费
        </span>
        <Steps current={stepNum} status={stepStatus} >
          <Step
            title="签署协议"
            icon={
              stepNum <= 0
                ? <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_1@2x.png" alt="tubobo-2" />
                : <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_1@2x.png" alt="tubobo-2" />
            }
          />
          <Step
            title="缴纳费用"
            icon={
              stepNum <= 1 ?
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_2@2x.png" alt="tubobo-2" /> :
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_2@2x.png" alt="tubobo-2" />
            }
          />
          <Step
            title="签约成功"
            icon={
              stepNum <= 2 ?
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_3@2x.png" alt="tubobo-2" /> :
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_3@2x.png" alt="tubobo-2" />
            }
          />
        </Steps>
        {
          stepNum === 1 && <div className="protocolSteps-1 protocolSteps_stepNum1">
            <div className="shop-protocol-title">
              兔波波门店合作协议
            </div>
            <span className="protocolSteps-smalltitle">请仔细阅读以下服务协议并完成签署哦</span>
            <div className="protocolSteps-child">
              <Protocol
                width="100%"
                height="310px"
                alipayAccount=""
                handleChange={this.handleChange.bind(this)}
                checked={checked}
                checkboxStatus={checkboxStatus}
                wealPolicyContent={wealPolicyContent}
              />
              <div className="shop-protocol-button">
                <Button type="primary" disabled={!checked} onClick={this.props.nextStep}>确认签署</Button>
              </div>
            </div>
          </div>
        }
        {
          stepNum === 2 && <div className="protocolSteps-1 protocolSteps_stepNum2">
            <div className="protocolRenew_stepNum2_div">
              <div className="protocolSteps_stepNum2_h3">
                <p>系统使用费：
                  <span className="price">{money && `￥${money}`}</span>
                </p>
                <p style={{ borderLeft: 'none' }}>收款方：{`${payee}`}</p>
              </div>
              <div
                className="protocolSteps_stepNum2_h3"
                style={{ border: '1px solid #E8E8E8', borderTop: 'none' }}
              >
                <p style={{ border: 'none', width: '500px' }}>有效期：{`${effectTime}`}</p>
              </div>
            </div>
            { (money && money > 0) ?
              <Button
                type="primary"
                loading={loading}
                onClick={this.nextStepPay.bind(this, { myStep: 3 })}
              >缴纳费用</Button> :
              <Button
                type="primary"
                loading={loading}
                onClick={this.disPay.bind(this)}
              >下一步</Button>
            }
          </div>
        }
        {
          stepNum === 3 && <div className="protocolSteps-1 protocolSteps_stepNum3">
            <div className="protocolSteps_stepNum3_img">
              <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/ok@2x.png" alt="tubobo-2" />
              <span className="protocolSteps-smalltitle">续签成功啦！</span>
            </div>
            <div className="shop-protocol-button">
              <Button
                type="primary"
                onClick={() => {
                  browserHistory.push('/Manage/HomePage');
                  location.reload();
                }}
              >开启门店</Button>
            </div>
          </div>
        }
        {
          htmlCode && <div style={{ float: 'left' }}>{this.create()}</div>
        }
      </div>
    );
  }
}

export default View;
