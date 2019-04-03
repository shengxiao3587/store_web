import React, { Component } from 'react';
import { Input } from 'antd';
import './doubleInput.css';

export default class DoubleInput extends Component {
  constructor(props) {
    super(props);
    const value = props.value || {
      startInput: {
        value: '',
      },
      endInput: {
        value: '',
      },
    };
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || this.state.value;
      this.setState(Object.assign({}, this.state, {
        value,
      }));
    }
  }

  startChange(a) {
    this.setState({
      value: {
        ...this.state.value,
        startInput: {
          value: a.target.value,
        },
      },
    }, () => {
      this.props.onChange(this.state.value);
    });
  }
  endChange(a) {
    this.setState({
      value: {
        ...this.state.value,
        endInput: {
          value: a.target.value,
        },
      },
    }, () => {
      this.props.onChange(this.state.value);
    });
  }
  render() {
    const {
      value,
    } = this.state;
    const {
      disabled,
      className,
      placeholder = {},
      startHidden,
      endHidden,
      istextarea,
    } = this.props;
    return (
      <div style={{ width: '100%' }} className={className || 'doubleInput'}>
        <Input
          title={value.startInput.value || ''}
          placeholder={placeholder.start}
          type={istextarea ? 'textarea' : 'text'}
          value={value.startInput.value || '-'}
          disabled={disabled}
          className={'doubleInput_start'}
          onChange={this.startChange.bind(this)}
          hidden={startHidden}
        />
        <Input
          title={value.endInput.value || ''}
          placeholder={placeholder.end}
          type="text"
          value={value.endInput.value || '-'}
          disabled={disabled}
          className={'doubleInput_end'}
          onChange={this.endChange.bind(this)}
          hidden={endHidden}
        />
      </div>
    );
  }
}
