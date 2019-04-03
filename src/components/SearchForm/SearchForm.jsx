import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import { createFormItem } from '../../components';
import './SearchForm.scss';

const FormItem = Form.Item;

class AdvancedSearchForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.func,
  }

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
    this.getValues((value) => {
      this.props.initSearchParams && this.props.initSearchParams(value);
    });
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.responsiveHandler);
  }

  componentWillUnmount() {
    this.mql && this.mql.removeListener(this.responsiveHandler);
  }

  getValues(callback) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const res = {};
        const {
          fields,
        } = this.props;

        const keys = Object.keys(values || {});
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          const field = fields.find((value) =>
            (value.name || value.dataIndex) === key
          );
          const formatMap = {
            dateRange: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
            twodateRange: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
            monthRange: ['YYYY-MM', 'YYYY-MM'],
            dateTimeRange: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
            month: 'YYYY-MM-01',
          };
          const format = formatMap[field.type] || 'YYYY-MM-DD HH:mm:ss';
          switch (field.type) {
            case 'dateRange':
            case 'dateTimeRange':
            case 'monthRange':
            case 'twodateRange':
              res[`${key}Start`] = values[key] && values[key].length !== 0 && values[key][0] && values[key][0].format
                ? values[key][0].format(format[0]) : (values[key] && values[key][0]) || '';
              res[`${key}End`] = values[key] && values[key].length !== 0 && values[key][1] && values[key][1].format
                ? values[key][1].format(format[1]) : (values[key] && values[key][1]) || '';
              break;
            case 'date':
            case 'dateTime':
            case 'month':
              res[key] = values[key] && values[key].format ? values[key].format(format) : values[key];
              break;
            default:
              res[key] = values[key];
          }
        }
        callback(res);
      }
    });
  }

  handleSearch = () => {
    this.getValues((values) => {
      const pageSize = (this.props.page && this.props.page.pageSize) || '10';
      this.props.search && this.props.search({
        ...values,
        pageNo: '1',
        pageSize,
      });
    });
  }

  handleReset = () => {
    if (this.props.reset) {
      this.props.reset();
    } else {
      this.props.form.resetFields();
    }
  }

  render() {
    const {
      fields,
    } = this.props;

    const {
      expand,
    } = this.state;

    // To generate mock Form.Item
    const children = [];
    const len = fields.length;
    const labelCol = expand ? 7 : 4;
    const wrapperCol = expand ? 17 : 20;
    for (let i = 0; i < len; i += 1) {
      children.push(
        createFormItem({
          field: fields[i],
          form: this.props.form,
          formItemLayout: {
            labelCol: { span: fields[i].large ? 2 : labelCol },
            wrapperCol: { span: fields[i].large ? 22 : wrapperCol },
          },
          inputOpts: {
          },
          colSpan: !expand || fields[i].large ? 24 : 8,
        })
      );
    }

    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row gutter={20}>
          {children}
        </Row>
        <Row gutter={20}>
          <Col span={8} style={{ textAlign: 'left' }}>
            <FormItem wrapperCol={{ span: 17, offset: 7 }}>
              <Button type="primary" onClick={this.handleSearch} style={{ width: 195 }}>搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const SearchForm = Form.create({
  mapPropsToFields(props) {
    const res = {};
    const keys = Object.keys(props.searchParams || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const param = props.searchParams[key];
      if (typeof param === 'object' && !(param instanceof Array)) {
        res[key] = param;
      } else {
        res[key] = { value: param };
      }
    }
    return res;
  },
  onFieldsChange(props, fieldsTemp) {
    const fields = fieldsTemp;
    const keys = Object.keys(fields || {});
    const findFun = (name) => (item) => item.name === name;
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const fld = props.fields.find(findFun(fields[key].name));
      fields[key].type = fld && fld.type;
    }
    props.changeSearch && props.changeSearch({
      ...props.searchParams,
      ...fields,
    });
  },
})(AdvancedSearchForm);
export default SearchForm;
