import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { common } from '../../store/common';
import DropdownPanelWrapper from './DropdownPanel';

const { Header } = Layout;

class TopMenuWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: document.body.clientWidth > 768,
    };

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        });
      } else {
        this.setState({
          expand: true,
        });
      }
    });
  }

  componentDidMount() {
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.responsiveHandler);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.firstLeaf && (newProps.firstLeaf.href !== (this.props.firstLeaf && this.props.firstLeaf.href))) {
      browserHistory.push(newProps.firstLeaf.href);
      this.props.initialMenu();
    }
  }

  componentWillUnmount() {
    this.mql && this.mql.removeListener(this.responsiveHandler);
  }

  onClick({ key }) {
    this.props.clickTopMenu(key);
  }

  createMenu = (data) => data.map((item) => <Menu.Item key={item.id}><a>{item.name}</a></Menu.Item>);

  render() {
    return (
      <Header className="header flex flex-c flex-js">
        <DropdownPanelWrapper />
      </Header>
    );
  }
}

const TopMenu = connect((state) => {
  const topMenuData = state.common.menus;
  return {
    topMenuData,
    selectedKeys: state.common.selectedTopKeys,
    firstLeaf: state.common.firstLeaf,
  };
}, {
  clickTopMenu: common.clickTopMenu,
  initialMenu: common.initialMenu,
})(TopMenuWrapper);

export default TopMenu;
