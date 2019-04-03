import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import PropTypes from 'prop-types';

export default class Captcha extends Component {
  static propTypes = {
    // onChange: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    // placeholder: PropTypes.string,
    // icon: PropTypes.string,
    // count: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: '获取短信验证码',
      btnDisabled: false,
      counting: false,
      loading: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.setState({
      text: '获取短信验证码',
      btnDisabled: false,
      counting: false,
      loading: false,
    });
  }

  onChange(value) {
    this.props.onChange(value);
  }

  onClick() {
    this.setState({
      ...this.state,
      loading: true,
    });
    this.props.onClick().then((isSuccess) => {
      this.setState({
        ...this.state,
        loading: false,
      });
      if (isSuccess) {
        let count = this.props.count || 60;
        this.timer = setInterval(() => {
          if (count > -1) {
            this.setState({
              text: `重新发送${count}s`,
              btnDisabled: true,
              counting: true,
            });
            count -= 1;
          } else {
            this.setState({
              text: '获取短信验证码',
              btnDisabled: false,
              counting: false,
            });
            clearTimeout(this.timer);
          }
        }, 1000);
      }
    });
  }

  timer;

  render() {
    const {
      placeholder,
      className,
      value,
    } = this.props;

    return (
      <Row span={24} style={{ textAlign: 'right' }}>
        <Col span={16} xl={18} xs={14} sm={15} md={16} lg={18}>
          <Input
            onChange={this.onChange.bind(this)}
            placeholder={placeholder}
            value={value}
          />
        </Col>
        <Col span={8} xl={6} xs={10} sm={9} md={8} lg={6}>
          <Button
            className={className ? `${className}-btn` : ''}
            style={{ width: '100%' }}
            type="primary"
            disabled={this.state.btnDisabled}
            onClick={this.onClick.bind(this)}
            loading={this.state.loading}
          >{this.state.text}</Button>
        </Col>
      </Row>
    );
  }
}
