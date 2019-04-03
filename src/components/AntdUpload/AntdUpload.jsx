import React, { Component } from 'react';
import { Upload, Modal, message, Icon } from 'antd';
import { getBaseUrl } from '../../util';

export default class AntdUpload extends Component {
  constructor(props) {
    super(props);
    const value = props.value || [];
    this.state = {
      value,
      previewVisible: false,
      previewImage: '',
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

  onPicCancel() {
    this.setState({ previewVisible: false });
  }

  handlePreview(file) {
    this.setState({
      previewImage: file.url || '',
    }, () => {
      this.setState({ previewVisible: true });
    });
  }

  handleChange(info) {
    if (info.file.status === 'done') {
      if (info.file.response.resultCode !== '0') {
        message.error(info.file.response.resultDesc);
      }
      this.setState({
        previewImage: '',
      });
    }

    const value = [];
    const fileList = info.fileList;
    fileList.forEach((item) => {
      const ite = {
        ...item,
      };
      value.push({
        response: ite.response,
        uid: ite.uid,
        name: this.props.picName || ite.name,
        status: ite.status,
        url: ite.response && ite.response.resultData,
        type: ite.type,
        size: ite.size,
        percent: ite.percent,
        lastModifiedDate: ite.lastModifiedDate,
        lastModified: ite.lastModified,
      });
    });

    this.setState({ value }, () => {
      this.props.onChange(this.state.value);
    });
  }
  handleRemove() {
    if (this.props.disabled) {
      return false;
    }
    return null;
  }

  render() {
    const {
      previewVisible,
      value,
      previewImage,
    } = this.state;
    const {
      maxPics = 1,
      data,
      picture = 'picture',
      disabled,
      beforeUpload,
    } = this.props;
    const uploadButton = (
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%' }}><Icon type="plus" className="avatar-uploader-trigger" /></div>
      </div>
    );
    return (
      <div className="picture_upload">
        <Upload
          className="picture_upload_load"
          action={`${getBaseUrl()}/common/photo/upload`}
          onPreview={this.handlePreview.bind(this)}
          fileList={value}
          data={data}
          onRemove={this.handleRemove.bind(this)}
          listType={picture}
          onChange={this.handleChange.bind(this)}
          beforeUpload={beforeUpload}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: !disabled,
          }}
          disabled={disabled}
          // name="avatar"
        >
          { (value.length >= maxPics) ? null : uploadButton }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.onPicCancel.bind(this)}>
          {
            !previewImage ? <div style={{ width: '100%', textAlign: 'center' }}>无图片</div>
              : <img alt="" style={{ width: '100%' }} src={previewImage} />
          }
        </Modal>
      </div>
    );
  }
}
