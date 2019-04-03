import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Icon,
} from 'antd';
import {
  Link,
} from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { common } from '../../store/common';
import { getSideMenus } from '../../selectors';

const { SubMenu } = Menu;

class SideMenu extends Component {
  static propTypes = {
    menuData: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array,
  }

  static defaultProps = {
    selectedKeys: [],
  }

  constructor(props) {
    super(props);
    const isRunFlag = localStorage.getItem('isRunFlag');
    props.searchStoreStatus()
      .then(() => {
        if (isRunFlag === '1' && localStorage.isRunFlag === '0') {
          location.reload();
        }
        props.menuLoad();
      });
  }

  onClick({ key }) {
    this.props.clickMenuItem(key);
  }

  onTitleClick({ key }) {
    this.props.clickSubMenu(key);
  }

  // onOpenChange (openKeys) {
  //   this.props.menuOpen(openKeys)
  // }

  renderMenu(menus) { // recursion to render the sideMenu
    return menus.map((menu) => {
      if (menu.children) {
        return (
          <SubMenu
            key={menu.id}
            title={
              <span>
                {menu.icon && <Icon type={menu.icon} />}<span>{menu.name}</span>
              </span>
            }
            onTitleClick={this.onTitleClick.bind(this)}
          >
            {this.renderMenu(menu.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={menu.id}>
          <Link to={menu.href}>
            {menu.icon && <Icon type={menu.icon} />}<span>{menu.name}</span>
          </Link>
        </Menu.Item>
      );
    });
  }

  render() {
    const {
      menuData,
      selectedKeys,
      openKeys,
    } = this.props;
    return (
      <Scrollbars
        style={{ height: document.body.clientHeight - 300 }}
      >
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[...selectedKeys]}
          openKeys={openKeys}
          // onOpenChange={::this.onOpenChange}
          onClick={this.onClick.bind(this)}
        >
          {this.renderMenu.bind(this)(menuData)}
        </Menu>
      </Scrollbars>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKeys: state.common.selectedKeys || [],
  openKeys: state.common.openedKeys || [],
  menuData: getSideMenus(state),
});

const mapDispatchToProps = {
  menuLoad: common.loadMenu,
  searchStoreStatus: common.searchStoreStatus,
  menuOpen: common.menuOpen,
  clickTopMenu: common.clickTopMenu,
  clickSubMenu: common.clickSubMenu,
  clickMenuItem: common.clickMenuItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
