import React, { Component } from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import SideMenu from '../../components/SideMenu';
import '../../styles/core.scss';
import './CoreLayout.css';
import ChangePwdFormWrapper from './PwdForm';
import TopMenuWrapper from './TopMenu';

const { Content, Sider } = Layout;

class CoreLayout extends Component {
  render() {
    return (
      <Layout>
        <ChangePwdFormWrapper />
        <Sider
          collapsible
          collapsedWidth="0"
          breakpoint="sm"
          width={200}
        >
          <layout className="flex flex-v" style={{ height: '100%', borderRight: '1px solid #ececec' }}>
            <div className="logo-wrapper flex flex-c flex-v">
              <div className="logo">
                <img
                  alt=""
                  src="//tubobo-qd.oss-cn-shanghai.aliyuncs.com/tubobo-storedesk-web/Page 1@2x.png"
                  style={{ height: 100 }}
                />
              </div>
              <div className="logo-title" style={{ margin: '8px 0' }}>
                {localStorage.storeName && JSON.parse(localStorage.storeName)}
              </div>
              {
                localStorage.isRunFlag === '0' ?
                  <div style={{ color: '#FFD800' }}>营业中</div> : <div style={{ color: '#FF4E08' }}>暂停营业</div>
              }
            </div>
            <SideMenu />
          </layout>
        </Sider>
        <Layout>
          <TopMenuWrapper />
          <Scrollbars
            style={{ height: document.body.clientHeight - 64 }}
          >
            <Content style={{ padding: 0, margin: 0, height:'100%' }}>
              {this.props.children}
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    );
  }
}

export default connect()(CoreLayout);
