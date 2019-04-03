import React, { Component } from 'react';
import { Radio, Spin } from 'antd';
import './CommonSetting.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class CommonSetting extends Component {
  render() {
    const {
      loading,
      setType,
      setData,
      that,
      className,
    } = this.props;
    const roleType = localStorage.getItem('roleType');
    return (<div className={`pickup_child ${className}`}>
      <span className="pickup_h3">{ setData.title }</span>
      <Spin spinning={loading}>
        <div className="downStyle">
          <RadioGroup
            size="large"
            onChange={roleType === '10' && that.handleChange.bind(that, setData.type)}
            value={setType}
          >
            <RadioButton value={0}>
              <div
                className="pickup_radio"
              >
                {setType === 0 ?
                  <div
                    className="pic"
                    style={{
                      backgroundImage: `url(${setData.picData[0]})`,
                      backgroundSize: 'contain',
                    }}
                  />
                  : <div
                    className="pic"
                    style={{
                      backgroundImage: `url(${setData.picData[2]})`,
                      backgroundSize: 'contain',
                    }}
                  /> }
                <div className="pickup_radio_h2">{ setData.titleData[0] }</div>
              </div>
            </RadioButton>
            <RadioButton value={1}>
              <div
                className="pickup_radio"
              >
                {setType === 1 ?
                  <div
                    className="picy"
                    style={{
                      backgroundImage: `url(${setData.picData[3]})`,
                      backgroundSize: 'contain',
                    }}
                  />
                  : <div
                    className="picy"
                    style={{
                      backgroundImage: `url(${setData.picData[5]})`,
                      backgroundSize: 'contain',
                    }}
                  /> }
                <div className="pickup_radio_h2">{ setData.titleData[1] }</div>
              </div>
            </RadioButton>
          </RadioGroup>
          {
            setData.downData.map((text) => (
              <a
                href={text.href}
                download={text.fileName}
                key={text.href + text.content}
                className={'downfile'}
              >
                {text.content}</a>)
            )
          }
        </div>
        {
          setData.stateData.map((text) => (
            <div
              className="pickup_instructions"
              key={text.statement}
            >
              <p>
                { text.statement }
              </p>
              <p>
                { text.first }
              </p>
              <p>
                { text.second }
              </p>
            </div>)
          )
        }
      </Spin>
    </div>);
  }
}
