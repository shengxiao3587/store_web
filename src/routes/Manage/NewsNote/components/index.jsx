import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';
import './newsnote.css';

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.dict('smsStatus').then(() => {
      props.search(props.searchParamsStart);
    });
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  search(params) {
    const { props } = this;
    const { searchParams } = props;
    props.search({
      ...searchParams,
      ...params,
    });
  }
  render() {
    const {
      dicts,
      smsStatus,
    } = this.props;

    const columns = [
      {
        label: '短信类型',
        name: 'newsType',
        type: 'select',
        data: [['qujian', '取件'], ['jijian', '寄件']],
        search: true,
      },
      {
        label: '模板Id',
        name: 'templateId',
      },
      {
        label: '联系电话',
        name: 'receiverPhone',
        search: true,
        placeholder: '请输入用户联系电话',
      },
      {
        label: '短信内容',
        name: 'templateContent',
        width: 300,
      },
      {
        label: '时间',
        name: 'time',
        search: true,
        type: 'twodateRange',
        required: true,
        validator: (rule, values, callback) => {
          if ((values.startValue || values[0]) && (values.endValue || values[1])) {
            callback();
          }
          if (!values.startValue && !values[0]) {
            callback('请输入开始时间');
          }
          if (!values.endValue && !values[1]) {
            callback('请输入结束时间');
          }
        },
      },
      {
        label: '发送结果',
        name: 'result',
        type: 'select',
        data: dicts.smsStatus,
        search: true,
        render: (text, record) =>
          (<div
            className="newsNote_result"
            style={(text === '2' || text === '10') ? { color: '#FF4444' } : {}}
          >
            <span>{smsStatus[text]}</span>
            {
              (text === '2' || text === '10') && <span>{`(${record.failReason || '-'})`}</span>
            }
          </div>),
      },
    ];


    return (
      <div className="newsNote" style={{ width: '100%' }}>
        <ListPage
          {...this.props}
          search={this.search.bind(this)}
          title="短信记录"
          columns={columns}
        />
      </div>
    );
  }
}

export default View;
