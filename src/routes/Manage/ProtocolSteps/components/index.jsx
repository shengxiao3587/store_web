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
  componentWillReceiveProps(nextprops) {
    if (nextprops.stepNum === 4) {
      localStorage.setItem('entryProcess', true);
      browserHistory.push('/Manage/HomePage');
    }
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
  nextStep(param) {
    const params = {
      ...param,
      step: this.props.stepNum,
    };
    this.props.nextStep(params).then((success) => {
      if (success && params.myStep === undefined) {
        this.props.getStatus();
      }
    });
  }
  nextStepPay(param) {
    const params = {
      ...param,
      flag: 'entry',
      step: this.props.stepNum,
      url: `${window.location.protocol}//${window.location.host}/Manage/ProtocolRenew`,
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
      payee = '浙江极配科技有限公司',
      payFlag,
      effectTime,
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
          门店入驻流程
        </span>
        <Steps current={stepNum} status={stepStatus} >
          <Step
            title="入驻审核"
            icon={
              stepNum <= 0
                ? <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_1@2x.png" alt="tubobo-2" />
                : <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_1@2x.png" alt="tubobo-2" />
            }
          />
          <Step
            title="签署协议"
            icon={
              stepNum <= 1 ?
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_2@2x.png" alt="tubobo-2" /> :
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_2@2x.png" alt="tubobo-2" />
            }
          />
          <Step
            title="缴纳保证金"
            icon={
              stepNum <= 2 ?
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_3@2x.png" alt="tubobo-2" /> :
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_3@2x.png" alt="tubobo-2" />
            }
          />
          <Step
            title="入驻成功"
            icon={
              stepNum >= 3 ?
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/y_4@2x.png" alt="tubobo-2" /> :
                <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/g_4@2x.png" alt="tubobo-2" />
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
                <Button type="primary" disabled={!checked} onClick={this.nextStep.bind(this, {})}>确认签署</Button>
              </div>
            </div>
          </div>
        }
        {
          stepNum === 2 && <div className="protocolSteps-1 protocolSteps_stepNum2">
            <div>
              <span className="protocolSteps-smalltitle">恭喜您完成
                <a
                  role="button"
                  tabIndex="-1"
                  onClick={this.showProtocol.bind(this)}
                  style={{ color: 'blue' }}
                >《兔波波门店合作协议》</a>
                协议签署，还差一步就能入驻成功啦，请完成保证金缴纳哦
              </span>
            </div>
            <div className="protocolRenew_stepNum2_div">
              <div className="protocolSteps_stepNum2_h3">
                <p>入驻保证金：{money && `￥${money}`}</p>
                <p style={{ borderLeft: 'none' }}>收款方：{`${payee}`}</p>
              </div>
              <div
                className="protocolSteps_stepNum2_h3"
                style={{ border: '1px solid #E8E8E8', borderTop: 'none' }}
              >
                <p style={{ border: 'none', width: '500px' }}>有效期：{`${effectTime}`}</p>
              </div>
            </div>
            {
              payFlag === true ? <Button
                type="primary"
                loading={loading}
                onClick={this.nextStepPay.bind(this, { myStep: 3 })}
              >缴纳保证金</Button>
                : <Button
                  type="primary"
                  loading={loading}
                  onClick={this.nextStep.bind(this, { myStep: 3 })}
                >下一步</Button>
            }
          </div>
        }
        {
          stepNum === 3 && <div className="protocolSteps-1 protocolSteps_stepNum3">
            <div className="protocolSteps_stepNum3_img">
              <img src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/ok@2x.png" alt="tubobo-2" />
              <span className="protocolSteps-smalltitle">恭喜你完成入驻，快去探索新功能吧！老厉害了！</span>
            </div>
            <div className="shop-protocol-button">
              <Button type="primary" onClick={() => browserHistory.push('/Manage/HomePage')}>立即探索</Button>
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
