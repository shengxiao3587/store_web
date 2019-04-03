import React, { Component } from 'react';
import { Tabs } from 'antd';
import './senderTask.scss';
import WaitExpress from './WaitExpress';
import SendExpress from './SendExpress';
import FinishExpress from './FinishExpress';

const TabPane = Tabs.TabPane;

class View extends Component {
  componentDidMount() {
    const {
      search,
      searchParams,
      page,
    } = this.props;
    search({
      ...searchParams,
      ...page,
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  tabsChange(key) {
    const {
      tabsChange,
      search,
    } = this.props;
    tabsChange(key);
    /*
     * sendStatus
      *  待处理：'RECEIVE,PICKUP,HANDLE';
      *  待寄出：'SEND';
      *  已完成： 'FINISH,CANCEL'
     */
    let sendStatus = 'RECEIVE,PICKUP,HANDLE';
    switch (key) {
      case '0':
        sendStatus = 'RECEIVE,PICKUP,HANDLE';
        break;
      case '1':
        sendStatus = 'SEND';
        break;
      case '2':
        sendStatus = 'FINISH,CANCEL';
        break;
      default:
        break;
    }
    setTimeout(() => {
      search({
        ...this.props.searchParams,
        ...this.props.page,
        sendStatus,
      });
    }, 1);
  }
  close(params) {
    const {
      // 关闭任务
      close,
      search,
      searchParams,
      page,
    } = this.props;
    close(params).then(() => {
      search({
        ...searchParams,
        ...page,
      });
    });
  }
  render() {
    const {
      activeKey,
    } = this.props;
    return (<div style={{ width: '100%' }} className="SenderTask">
      <Tabs
        onChange={this.tabsChange.bind(this)}
        activeKey={activeKey}
      >
        <TabPane tab="用户下单" key="0">
          <WaitExpress
            {...this.props}
            close={this.close}
            that={this}
          />
        </TabPane>
        <TabPane tab="待寄出" key="1">
          <SendExpress
            {...this.props}
            close={this.close.bind(this)}
            that={this}
          />
        </TabPane>
        <TabPane tab="已完成" key="2">
          <FinishExpress
            {...this.props}
          />
        </TabPane>
      </Tabs>
    </div>);
  }
}

export default View;
