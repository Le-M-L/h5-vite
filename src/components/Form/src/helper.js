import { dateUtil } from '@/utils/dateUtil';
import { isNumber, isObject } from '@/utils/is';

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component) {
  if (component.includes('Input') || component.includes('Complete')) {
    return '请输入';
  }
  if (component.includes('Picker')) {
    return '请选择';
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return '请选择';
  }
  return '';
}

const DATE_TYPE = ['MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
  return [...DATE_TYPE, 'RangePicker'];
}

export function setComponentRuleType(rule, component, valueFormat) {
  if (['MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object';
  } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array';
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number';
  }
}

export function processDateValue(attr, component) {
  const { valueFormat, value } = attr;
  if (valueFormat) {
    attr.value = isObject(value) ? dateUtil(value).format(valueFormat) : value;
  } else if (DATE_TYPE.includes(component) && value) {
    attr.value = dateUtil(attr.value);
  }
}

export function handleInputNumberValue(component, val) {
  if (!component) return val;
  if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
    return val && isNumber(val) ? `${val}` : val;
  }
  return val;
}

/**
 * 时间字段
 */
export const dateItemType = genType();

export const formatSchemas = (data = []) => {
  console.log(data);
  let fromSchemas = Object.keys(data).map((key) => {
    let items = data[key];
    const schemasItem = {
      field: key,
      show: !items.hidden,           // 隐藏
      label: items.title,           // 显示字段名
      order: items.order,
      required:true,
      componentProps:{
        ...(items.ui?.widgetattrs || {})
      },            // 属性
    };
    switch (items.view) {
      case 'hidden': // 隐藏
        break;
      case 'date': // 日期选择
        schemasItem.component = 'DatePicker';
        break;
      case 'text': // 输入框
        schemasItem.component = 'Input';
        break;
      case 'popup': // 弹窗
        break;
      case 'list': // 下拉框
        schemasItem.componentProps.options = items.enum;
        schemasItem.componentProps.labelField = 'text';
        schemasItem.componentProps.valueField = 'value';
        schemasItem.component = 'ApiSelect';
        break;
      case 'number': // 数字类型
        schemasItem.component = 'InputNumber';
        break;
      case 'radio': // 单选框
        schemasItem.component = 'ApiRadioGroup';
        break;
      case 'image': // 图片上传
        schemasItem.component = 'Upload';
        break;
      case 'textarea': // 多行文本框
        schemasItem.component = 'InputTextArea';
        break;
      default:
        break;
    }
    return schemasItem;
  });
  fromSchemas.sort((a, b) => (a.order = b.order))
  return [
    {
      field: 'key',
      label: '测试',           // 显示字段名
      component:'Input',
      required:true,
    }
  ];
};
