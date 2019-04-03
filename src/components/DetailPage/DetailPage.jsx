import React, { Component } from 'react';
import { Row, Col, Form, Button, Spin } from 'antd';
import { createFormItem, mapPropsToFields, onFieldsChange } from '../../components';
import './detailPage.css';

const FormItem = Form.Item;
class DetailPage extends Component {
  static propTypes = {
  };

  componentDidMount() {
    const { props } = this;
    if (props.getForm) {
      props.getForm(props.form);
    }
  }

  render() {
    const {
      title,
      fields = [],
      form,
      loading = false,
      buttonCenter = false,
      buttons = [],
      children = [],
      childNode = '',
    } = this.props;
    let PercentCount;
    if (document.body.clientWidth > 1360) {
      PercentCount = 8;
    } else {
      PercentCount = 11;
    }
    const butt = buttons.map((item, index) => {
      const key = `button${index}`;
      const { hidden, style, type, handleForm, onClick, disabled, label } = item;
      if (!hidden) {
        return (<Button
          style={style}
          key={key}
          type={type || 'primary'}
          onClick={(handleForm || onClick).bind(this, form)}
          disabled={disabled}
          loading={item.loading}
        >
          { label }
        </Button>);
      }
      return false;
    });

    const formItemLayout = ({
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    });

    const geneForm = (fieldsTemp) => (
      <Spin spinning={loading}>
        <Form layout="horizontal">
          <Row>
            {
              fieldsTemp.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                  inputOpts: {
                  },
                })
              ))
            }
          </Row>
          {
            childNode
          }
          <FormItem
            className="detailPage_formitem"
            style={{
              textAlign: buttonCenter ? '' : 'center',
              marginLeft: buttonCenter ? `${PercentCount}%` : '' }}
          >
            { butt }
          </FormItem>
        </Form>
      </Spin>
    );
    return (
      <div className="layout-content-detail">
        {
          title &&
          <Row type="flex" justify="space-between" align="middle" className="detailPage">
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
          </Row>
        }
        {geneForm(fields)}
        {
          children
        }
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields,
  onFieldsChange,
})(DetailPage);

