import React, { Component } from 'react';
import { Select, Spin, Row, Col, Carousel } from 'antd';
import createG2 from 'g2-react';
import { browserHistory } from 'react-router';
import { ArrayUtil, DateUtil } from '@xinguang/common-tool';
import './homepage.scss';

const Option = Select.Option;

const Line = createG2((chart) => {
  chart.line().position('currentDate*currentCount').color('type', ['#09BD26', '#FFD800'])
    .label('currentCount', (val) => val)
    .size(2);
  chart.col('currentDate', { alias: '日' });
  chart.col('currentCount', { alias: '包裹数' }).legend({
    position: 'bottom',
  });
  chart.axis('currentDate', {
    formatter: (val) => {
      const count = JSON.parse(localStorage.getItem('count')) || 1;
      localStorage.setItem('count', count + 1);
      return count % 2 !== 0 ? val : '';
    },
  });
  chart.render();
});

class View extends Component {
  componentDidMount() {
    // 计算图标的数据显示开始位置
    localStorage.setItem('count', 0);
    this.props.search();
  }
  dealWithClick() {
    this && browserHistory.push('/Manage/ProtocolRenew');
  }

  render() {
    const {
      loading,
      allData,
      InitData,
      changeSelect,
    } = this.props;
    const {
      recentlyMonthInList,
      recentlyMonthSignList,
      dealWithData = [],
    } = allData;
    const length = dealWithData.length;
    return (
      <div className="homepage">
        <Spin spinning={loading} style={{ width: '100%' }}>
          <p className="title">首页</p>
          <div className="news">
            <h3>门店经营数据</h3>
            <Row type="flex" justify="space-between" >
              <Col span={5} className="detail">
                <span className="state">
                  今日入库
                </span>
                <span>
                  { InitData.todayIn }<b> / 件</b>
                </span>
              </Col>
              <Col span={5} className="detail">
                <span className="state">
                  今日签收
                </span>
                <span>
                  { InitData.todaySign }<b> / 件</b>
                </span>
              </Col>
              <Col span={5} className="detail">
                <span className="state">
                  待签收
                </span>
                <span>
                  { InitData.totalExists }<b> / 件</b>
                </span>
              </Col>
              <Col span={5} className="detail">
                <span className="state">
                  七日签收率
                </span>
                <span>
                  { InitData.signRate.slice(0, 1) }<b> %</b>
                </span>
              </Col>
            </Row>
          </div>
          <div className="bannerPic">
            <Row type="flex" justify="space-between" align="middle">
              <Col className="logo-wrapper homePic">
                <header>{ `待办事项     (${length})` }</header>
                <div className="dealwiththing">
                  <section>
                    {
                      dealWithData.length === 0 ?
                        <div className="nothing">暂无待办事项</div> :
                        dealWithData.map((text, index) => {
                          const key = `${text}${index}`;
                          return (
                            <p key={key}>
                              <span className="sign">
                                {
                                  text.type === 'renew' &&
                                  <strong>续签</strong>
                                }
                                {
                                  text.type === 'toPay' &&
                                  <strong>缴费</strong>
                                }
                                <span style={{ display: 'none' }}>{text.type}</span>
                                {
                                  text.type === 'renew' &&
                                  <a
                                    role="button"
                                    tabIndex={-1}
                                    className="content"
                                    href={'/Manage/ProtocolRenew'}
                                  >
                                    您的合约即将到期，请<span>缴费续签</span>
                                  </a>
                                }
                                {
                                  text.type === 'toPay' &&
                                  <a
                                    role="button"
                                    tabIndex={-1}
                                    className="content"
                                    href={'/Manage/ProtocolRenew'}
                                  >
                                    若要门店正常营业，请<span>缴纳系统使用费</span>
                                  </a>
                                }
                              </span>
                              <span className="time">{DateUtil.formatDate(text.time)}</span>
                            </p>);
                        }
                        )
                    }
                  </section>
                </div>
              </Col>
              <Col className="logo-wrapper bannerCarousel">
                <Carousel dots="false">
                  <div className="carousel-content3 carousel-content">&nbsp;</div>
                </Carousel>
              </Col>
            </Row>
          </div>
          <div className="newsPic">
            <Row type="flex" justify="space-between" align="middle">
              <Col>
                包裹入库/签收分析
              </Col>
              <Col>
                <Select
                  defaultValue="7"
                  style={{ width: 120, float: 'left' }}
                  onChange={changeSelect.bind(this)}
                >
                  <Option value="7">近7天</Option>
                  <Option value="15">近15天</Option>
                  <Option value="30">近30天</Option>
                </Select>
              </Col>
            </Row>
            <div className="pic">
              <Line
                {...allData}
                data={
                  ArrayUtil.merge(recentlyMonthInList, recentlyMonthSignList)
                }
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default View;
