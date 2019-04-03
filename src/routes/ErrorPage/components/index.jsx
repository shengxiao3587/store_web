import React, { Component } from 'react';
import { Layout } from 'antd';
import WrappedNormalLoginForm from './NormalLoginForm';

const { Content } = Layout;

class View extends Component {
  render() {
    return (
      <Layout>
        <Content
          style={{
            padding: '160px 0',
            display: 'flex',
            // justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <WrappedNormalLoginForm />
        </Content>
      </Layout>
    );
  }
}

export default View;
