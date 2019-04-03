import React from 'react';
import { Form, Modal, Row, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { createFormItem, mapPropsToFields, onFieldsChange } from '../../components';

const ModalForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(
  (props) => {
    const {
      visible,
      onCancel,
      onCreate,
      title,
      fields,
      form,
      formWidth,
      cusTitle,
      confirmLoading,
      modalChildNode,
      className,
      footerButton,
      buttonText,
      hasFooter,
    } = props;
    const { validateFields } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const save = () => {
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          onCreate(values);
        }
      });
    };

    const footer = footerButton ? [
      <Button
        key="submit"
        size="large"
        type="primary"
        onClick={save}
        loading={confirmLoading}
        style={{ marginLeft: '32px' }}
        className="onlyOneButton"
      >
        {buttonText}
      </Button>,
    ] : [
      <Button size="large" key="back" type="default" onClick={onCancel}>取消</Button>,
      <Button
        key="submit"
        size="large"
        type="primary"
        onClick={save}
        loading={confirmLoading}
        style={{ marginLeft: '32px' }}
      >
        确定</Button>,
    ];

    const isEdit = () => !!(props.values && props.values.id);

    const geneForm = (fieldsTemp) => (
      <Scrollbars
        autoHeight
        autoHeightMin={100}
        autoHeightMax={550}
      >
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
          {modalChildNode}
        </Form>
      </Scrollbars>
    );

    return (
      <Modal
        className={className}
        width={formWidth || 1000}
        visible={visible}
        title={cusTitle || ((isEdit() ? '修改' : '新增') + title)}
        okText="保存"
        onCancel={onCancel}
        onOk={save}
        maskClosable={false}
        footer={hasFooter ? null : footer}
      >
        {geneForm(fields)}
      </Modal>
    );
  }
);
export default ModalForm;
