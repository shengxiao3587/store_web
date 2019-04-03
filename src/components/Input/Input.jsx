import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';

export default class Input extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    // value: PropTypes.string,
    disabled: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    let value = props.value;
    if (typeof value === 'number') {
      value = `${value}`;
    } else {
      value = value || undefined;
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value;
      if (typeof value === 'number') {
        value = `${value}`;
      } else {
        value = value || undefined;
      }
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      disabled,
    } = this.props;

    return (
      <AutoComplete
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        getPopupContainer={(node) => document.getElementsByClassName('ant-layout-content')[0] || node}
      >
        {
          disabled &&
            <input title={this.state.value} />
        }
      </AutoComplete>
    );
  }
}
