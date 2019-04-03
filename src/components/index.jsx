import React from 'react';
import {
  Input,
  Form,
  DatePicker,
  Col,
  Cascader,
  Checkbox,
  Radio,
  Switch,
  Icon,
  TimePicker,
} from 'antd';
import CommonSelect from './Select';
import Captcha from './Captcha';
import CommonCheckboxGroup from './CheckboxGroup';
import ImagePicker from './ImagePicker';
import CommonDatePicker from './DatePicker';
import MonthPicker from './MonthPicker';
import MonthRange from './MonthRange';
import DateRange from './DateRange';
import AutoComplete from './Input';
import InputNumber from './Number';
import NumberRange from './NumberRange';
import AmapComponent from './AmapComponent';
import AntdUpload from './AntdUpload';
import DoubleTimePicker from './DoubleTimePicker';
import DoubleInput from './DoubleInput';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const { RangePicker } = DatePicker;

const shapeSelectData = (field) => {
  const data = field.data;
  const valueName = field.valueName || 'id';
  const displayName = field.displayName || 'label';
  let res = [];
  if (Object.prototype.toString.call(data) === '[object Object]') {
    Object.keys(data).forEach((item) => {
      const itemObj = {};
      itemObj[valueName] = item;
      itemObj[displayName] = data[item];
      res.push(itemObj);
    });
  } else {
    res = data;
  }
  return res;
};


export const geneBox = (fieldTemp, opts = {}) => {
  const field = fieldTemp;
  if (field.dataIndex) {
    field.name = field.dataIndex;
  }
  if (field.title) {
    field.label = field.title;
  }

  const defaultOpts = {
    size: 'default',
    ...opts,
    disabled: field.disabled,
    name: field.name,
    label: field.label,

  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }

  switch (field.type) {
    case 'div':
      return (
        <div />
      );
    case 'captcha':
      return (
        <Captcha
          {...defaultOpts}
          placeholder={field.label}
          className={field.className}
          onClick={field.onClick}
          icon={field.icon}
        />
      );
    case 'date':
      return (
        <CommonDatePicker
          {...defaultOpts}
          format="YYYY-MM-DD"
          placeholder={field.disabled ? '-' : '请选择日期'}
          onChange={field.onChange}
          disabledDate={field.disabledDate}
        />
      );
    case 'cascader':
      return (
        <Cascader
          {...defaultOpts}
          placeholder={field.disabled ? '-' : '请选择地址'}
          options={field.data}
          changeOnSelect={!!field.changeOnSelect}
          onChange={field.onChange}
          getPopupContainer={(node) => document.getElementsByClassName('ant-layout-content')[0] || node}
        />
      );
    case 'datetime':
      return (
        <CommonDatePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={field.disabled ? '-' : '请选择时间'}
        />
      );
    case 'dateRange':
      return (
        <RangePicker
          {...defaultOpts}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
          placeholder={field.disabled ? '-' : ['请选择开始日期', '请选择结束日期']}
        />
      );
    case 'month':
      return (
        <MonthPicker
          {...defaultOpts}
          placeholder={field.disabled ? '-' : '请选择月份'}
        />
      );
    case 'doubleInput':
      return (
        <DoubleInput
          disabled={field.disabled}
          placeholder={field.placeholder}
          startHidden={field.startHidden}
          endHidden={field.endHidden}
          istextarea={field.istextarea}
        />
      );
    case 'datetimeRange':
      return (
        <RangePicker
          {...defaultOpts}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={field.disabled ? '-' : ['请选择开始时间', '请选择结束时间']}
        />
      );
    case 'monthRange':
      return (
        <MonthRange
          {...defaultOpts}
        />
      );
    case 'twodateRange':
      return (
        <DateRange
          {...defaultOpts}
        />
      );
    case 'amap':
      return (
        <AmapComponent
          {...defaultOpts}
          city={field.city}
          width={field.width}
          height={field.height}
          inputDatasource={field.inputDatasource}
          className={field.className}
        />
      );
    case 'AntdUpload':
      return (
        <AntdUpload
          {...defaultOpts}
          picName={field.picName}
          maxPics={field.maxPics}
          data={field.data}
          disabled={field.disabled}
          onChange={field.onChange}
          beforeUpload={field.beforeUpload}
          picture={field.picture}
          className={field.className}
        />
      );
    case 'select':
      return (
        <CommonSelect
          {...defaultOpts}
          state={field.state}
          placeholder={field.disabled ? '-' : `请选择${field.labelExtra || field.label}`}
          filterOption={field.filterOption ? field.filterOption : true}
          optionFilterProp={field.optionFilterProp}
          action={field.action}
          data={shapeSelectData(field)}
          multiple={field.multiple}
          valueName={field.valueName}
          displayName={field.displayName}
          onSelect={field.onSelect}
          showSearch={field.showSearch}
          allowClear={!field.required}
          page={field.page}
          inputWidth={field.inputWidth}
          addonBefore={field.addonBefore}
          addonAfter={field.addonAfter}
          appendToBody={field.appendToBody}
        />
      );
    case 'checkboxGroup':
      return (
        <CommonCheckboxGroup
          {...defaultOpts}
          label={field.label}
          options={field.options}
        />
      );
    case 'checkbox':
      return (
        <CheckboxGroup
          {...defaultOpts}
        />
      );
    case 'switch':
      return (
        <Switch
          checkedChildren={field.checkedChildren}
          unCheckedChildren={field.unCheckedChildren}
          {...defaultOpts}
        />
      );
    case 'image':
      return (
        <ImagePicker
          {...defaultOpts}
          data={field.data}
          tokenSeparators={field.tokenSeparators}
        />
      );
    case 'password':
      return (
        <Input
          type="password"
          {...defaultOpts}
          autoComplete="off"
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
        />
      );
    case 'number':
      return (
        <InputNumber
          {...defaultOpts}
          max={field.max || 1000000000000000} // 16 or 99...
          min={typeof field.min === 'number' ? field.min : undefined}
          money={field.money}
          placeholder={field.disabled ? '-' : `请输入${field.labelExtra || field.label}`}
        />
      );
    case 'textarea':
      return (
        <Input
          className={field.className}
          type="textarea"
          {...defaultOpts}
          placeholder={
            field.placeholder ||
            (field.disabled ? '-' : `请输入${field.labelExtra || field.label}`)
          }
          autosize={
            (field.disabled && !(field.minRows || field.maxRows))
              ? true : { minRows: field.minRows || 2, maxRows: field.maxRows || 6 }
          }
          maxLength={field.maxLength}
        />
      );
    case 'span':
      return (
        <a
          role="button"
          tabIndex={0}
          onClick={field.onClick || ''}
        >{field.spanName || field.label || field.name}</a>
      );
    case 'radio':
      return (
        <Radio.Group
          onChange={field.onChange}
        >
          {
            field.data.map((item) => <Radio value={item[0]} key={item[0]}>{item[1]}</Radio>)
          }
        </Radio.Group>
      );
    case 'numberRange':
      return (
        <NumberRange
          {...defaultOpts}
          startMin={field.startMin}
          endMin={field.endMin}
          startMax={field.startMax}
          endMax={field.endMax}
        />
      );
    case 'br':
      return (
        <br />
      );
    case 'doubleTime':
      return (
        <DoubleTimePicker
          onChange={field.onChange}
          format={field.format}
          disabled={field.disabled}
        />
      );
    case 'time':
      return (
        <TimePicker
          {...defaultOpts}
          onChange={field.onChange}
          disabledHours={field.disabledHours}
          disabledMinutes={field.disabledMinutes}
          disabledSeconds={field.disabledSeconds}
          hideDisabledOptions={field.hideDisabledOptions}
          format={field.format}
        />
      );
    case 'inputOnly':
      return (
        <Input
          {...defaultOpts}
          placeholder={
            field.placeholder ||
            (field.disabled ? '-' : `请输入${field.labelExtra || field.label}`)
          }
          onBlur={field.onBlur}
          onKeyDown={field.onKeyDown}
          onKeyUp={field.onKeyUp}
          onChange={field.onChange}
          style={field.childrenStyle}
          onFocus={field.onFocus}
          autoComplete="off"
          addonAfter={field.addonAfter}
          prefix={field.prefix}
          suffix={field.value ? <Icon type="close-circle" onClick={field.emitEmpty} /> : null}
        />
      );
    default:
      return (
        <AutoComplete
          {...defaultOpts}
          allowClear
          className={field.forbidRed ? 'forbidRed' : ''}
          placeholder={
            field.placeholder ||
            (field.disabled ? '-' : `请输入${field.labelExtra || field.label}`)
          }
          buttonText={field.buttonText}
          buttonClick={field.buttonClick}
          onBlur={field.onBlur}
          style={field.childrenStyle}
          onChange={field.onChange}
          dataSource={field.dataSource}
          prefix={field.prefix}
        />
      );
  }
};

export const createFormItem = (opts) => {
  let {
    formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    },
    colSpan = 12,
  } = opts;

  const {
    field,
    form,
    inputOpts,
  } = opts;
  inputOpts.form = form;
  if (field.dataIndex) {
    field.name = field.dataIndex;
  }
  if (field.title) {
    field.label = field.title;
  }
  if (!field.max && !field.type) {
    field.max = 120;
  }
  const rules = [];
  if (field.hidden && !field.search) {
    rules.push({
      required: false, // BUG? should set it
    });
  } else {
    let msgLabel = '';
    if (typeof field.label === 'string') {
      msgLabel = (field.labelExtra || field.label || '').replace(/\(.*\)/, '');
    }

    if (field.required) {
      let msgPefix = '请输入';
      if (['date', 'datetime', 'dateRange', 'datetimeRange', 'select'].indexOf(field.type) > -1) {
        msgPefix = '请选择';
      }
      if (field.type === 'image') {
        msgPefix = '请上传图片';
      }

      const messageDefined = field.placeholder || (`${msgPefix}${msgLabel}`);

      const rule = {
        required: !field.disabled,
        message: messageDefined,
      };

      if (!field.type || field.type === 'textarea') {
        rule.whitespace = true;
      }

      rules.push(rule);
    }
    if (field.validator) {
      rules.push({ validator: field.validator });
    }
    if (field.max && field.type !== 'number') {
      rules.push({
        max: field.max,
        message: `${msgLabel}在${field.max}个字以内`,
        transform: (v) => {
          let vTemp = v;
          if (typeof vTemp === 'number') {
            vTemp += '';
          }
          return vTemp;
        },
      });
    } else if (field.max && field.type === 'number') {
      rules.push({ validator: (rule, value, callback) => {
        if (value && field.max < +value) {
          callback(`${msgLabel}不能大于${field.max}`);
        }
        callback();
      } });
    }
    if (field.min && field.type !== 'number') {
      rules.push({
        min: field.min,
        message: `${msgLabel}必须大于等于${field.min}位`,
        transform: (v) => {
          let vTemp = v;
          if (typeof vTemp === 'number') {
            vTemp += '';
          }
          return vTemp;
        },
      });
    } else if (field.min && field.type === 'number') {
      rules.push({ validator: (rule, value, callback) => {
        if (value && field.min > +value) {
          callback(`${msgLabel}不能小于${field.min}`);
        }
        callback();
      } });
    }
    if (field.pattern) {
      rules.push({ pattern: field.pattern, message: field.patternMsg });
    }
    if (field.phone) {
      rules.push({ pattern: /^1[345678][0-9]{9}$/, message: '请输入正确的手机格式' });
    }
    if (field.fixedPhoneOrPhone) {
      // eslint-disable-next-line no-useless-escape
      rules.push({ pattern: /(^[0-9-]{1,13}$)|(^1[3|4|5|6|7|8|9][0-9]{9}$)/,
        message: '请输入正确的手机号码或者固定电话' });
    }
    if (field.number) {
      rules.push({ pattern: /^\d+$/, message: '请输入数字' });
    }
    if (field.positive) {
      rules.push({ pattern:/^((\d{1,5})|(\d{1,5}\.\d{1,2}))$/, message:'请输入不大于99999.99的正数，可保留两位小数' });
    }
    if (field.ID) {
      rules.push({
        pattern: new RegExp(
          `${/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|/.source
          }${/(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.source}`
        ),
        message: '身份证格式有误',
      });
    }
    if (field.char) {
      rules.push({ pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]*$/, message: '请输入字母+数字' });
    }
    if (field.thanOne) {
      rules.push({ pattern: /^[1-9]\d{0,7}\.{0,1}\d{0,2}$/, message: '请输入大于1的正数，最多有两位小数' });
    }
    if (field.twodecimal) {
      rules.push({ pattern: /^[0-9]\d{0,}\.{0,1}\d{0,2}$/, message: '请输入正数，最多有两位小数' });
    }
    if (field.zeroToTwo) {
      rules.push({
        pattern: /^(([0-2])|(0\.(0[0-9]{0,1}|[1-9][0-9]{0,1}))|(1\.\d\d{0,1})|(2\.0[0]{0,1}))$/,
        message: '请输入0~2的数，可保留两位小数',
      });
    }
  }

  if (field.long) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: formItemLayout.labelCol.span / 2,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.small) {
    colSpan = field.small;
    formItemLayout = field.layoutData || formItemLayout;
    formItemLayout = {
      labelCol: {
        span: formItemLayout.labelCol.span,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span),
      },
    };
  }

  let styles = {};
  if (!field.search && field.hidden) {
    styles.display = 'none';
  }
  if (field.style) {
    styles = {
      ...styles,
      ...field.style,
    };
  }

  if (field.type === 'checkboxGroup') {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.type === 'image' || field.image) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24 - (formItemLayout.labelCol.span / 2),
      },
    };
  }

  if (field.simple) {
    colSpan = 24;
    formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
  }
  if (field.formHalf) {
    colSpan = 16;
    let count;
    if (document.body.clientWidth > 1360) {
      count = 3;
    } else {
      count = 4;
    }
    formItemLayout = {
      labelCol: {
        span: count,
      },
      wrapperCol: {
        span: 16,
      },
    };
  }

  if (field.simpleHalf) {
    colSpan = 6;
    formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
  }

  if (field.className === 'title') {
    colSpan = 24;
    formItemLayout = {
    };
  }

  let className = (field.className && `${field.className}-form-item`) || '';
  if (!field.label) {
    className += ' item-no-required';
  }

  let children;
  if (field.type === 'title') {
    children = (<Col span={24} key={field.label + field.key} style={styles}>
      <div className={`ant-form-title ${className}`}>
        {typeof field.label === 'object' ? field.label : `${field.label}`}
        {field.titleBody && <span className={`${className}_body`}>{field.titleBody || ''}</span>}
      </div>
    </Col>);
  } else if (field.type === 'custom') {
    children = field.children;
  }
  let clone;
  if (field.colon === undefined) {
    clone = !!field.label;
  } else {
    clone = field.colon;
  }

  const formItemLabel = field.type === 'checkboxGroup' ? '' : (field.label || ' ');
  return (
    field.type === 'title'
      ? children
      : <Col span={colSpan} key={field.name}>
        <FormItem
          {...formItemLayout}
          label={formItemLabel}
          className={className}
          style={styles}
          colon={clone}
          extra={field.extra}
        >
          {
            form.getFieldDecorator(field.name, {
              valuePropName: field.type === 'switch' ? 'checked' : 'value',
              rules,
              initialValue: field.initialValue,
            })(geneBox(field, inputOpts))
          }
        </FormItem>
      </Col>
  );
};

export const mapPropsToFields = (props = {}) => {
  const res = {};
  const {
    fields = [],
    values = {},
  } = props;
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i].name;
    const param = values[key];
    if (typeof param === 'object' && param && 'value' in param) {
      res[key] = param;
    } else {
      res[key] = { value: param };
    }
  }
  return res;
};
export const onFieldsChange = (props, flds) => {
  const fields = flds;
  const keys = Object.keys(fields || {});
  const findFun = (name) => {
    const newName = name;
    return (item) => item.name === newName;
  };
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const fld = props.fields.find(findFun(fields[key].name));
    fields[key].type = fld && fld.type;
    fields[key] = {
      ...{ value: undefined },
      ...fields[key],
    };
  }
  props.changeRecord && props.changeRecord({
    ...props.values,
    ...fields,
  });
};
