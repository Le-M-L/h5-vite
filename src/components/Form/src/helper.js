import { dateUtil } from '@/utils/dateUtil';
import { isNumber, isObject, isString, isArray } from '@/utils/is';
/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component, label = '') {
  if (component.includes('Input') || component.includes('Complete')) {
    return `请输入${label}`;
  }
  if (component.includes('Picker')) {
    return `请选择${label}`;
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch') ||
    component.includes('CustomMap')
  ) {
    return `请选择${label}`;
  }
  return '';
}

const DATE_TYPE = ['MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
  return [...DATE_TYPE, 'RangePicker'];
}

// INPUT 输入框类型
export const INPUT_TYPE = [''];

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

/**
 * 格式化正则
 */
function getPattern(pattern, type) {
  if (!pattern) return null; // 无正则
  if ('z' == pattern) return '^-?\\d+$'; // 精度
  if ('only' == pattern) return null; //唯一校验
  return pattern;
}

/**
 * schema item
 * require 必填字段
 */
export const formatSchemas = (schema = [], require = [], readonly) => {
  let fromSchemas = Object.keys(schema).map((key) => {
    let items = schema[key];
    const schemasItem = {
      field: key,
      show: !items.hidden, // 隐藏
      label: items.title, // 显示字段名
      order: items.order,
      required: require.includes(key),
      pattern: getPattern(items.pattern, items.type), // 正则
      errorInfo: items.errorInfo, // 校验错误提示
      maxlength: items.maxLength, // 最大长度
      minLength: items.minLength, // 最小长度
      maximum: items.maximum, // 最大数
      minimum: items.minimum, // 最小数
      dbPointLength: items.dbPointLength, // 精度
      type: items.type,
      orgFields: items.orgFields, // popup  传给后台的数据字段
      destFields: items.destFields, // 表单接收的字段
      popupMulti: items.popupMulti, // popup 是否能多选
      isError: false,
      componentProps: {
        maxlength: items.maxLength,
        ...(items.ui?.widgetattrs || {}),
      }, // 属性
      defaultValue: items.defVal,
      itemProps: {
        code: items.code, // 弹窗表格code
        readonly: readonly || items.ui?.widgetattrs?.disabled, // 只读
      },
    };
    // 地图
    if(key == 'address_info'){
      items.view = 'map'
    }
    formatMode(schemasItem, items);
    return schemasItem;
  });
  fromSchemas.sort((a, b) => a.order - b.order);
  console.log(fromSchemas);
  // fromSchemas.push({
  //   label:'测试地图',
  //   field:'ddd',
  //   component:'CustomMap',
  // })
  return fromSchemas;
};

// 最大长度校验
export function validatorMax() {
  return Promise.resolve();
}

// 最小长度校验
export function validatorMin() {
  return Promise.resolve();
}

export function formatMode(schemasItem, items) {
  switch (items.view) {
    case 'string':
      schemasItem.component = 'Input';
      break;
    case 'map': // 地图
      schemasItem.component = 'CustomMap';
    break;
    case 'text': // 文本输入框
      schemasItem.component = 'Input';
      break;
    case 'integer': // 文本输入框 整数
      schemasItem.component = 'Input';
      schemasItem.componentProps.type = 'digit';
      break;
    case 'password': // 文本输入框
      schemasItem.component = 'Input';
      schemasItem.componentProps.type = 'password';
      break;
    case 'radio': // 单选框
      schemasItem.component = 'ApiRadioGroup';
      schemasItem.componentProps.options = items.enum;
      schemasItem.componentProps.labelField = 'text';
      schemasItem.componentProps.valueField = 'value';
      break;
    case 'checkbox': // 多选
      schemasItem.component = 'ApiCheckboxGroup';
      schemasItem.componentProps.options = items.enum;
      schemasItem.componentProps.labelField = 'text';
      schemasItem.componentProps.valueField = 'value';
      break;
    case 'rate': // 评分
      schemasItem.component = 'Rate';
      break;
    case 'switch': // switch 切换
      schemasItem.component = 'Switch';
      break;
    case 'pca': // 户籍地 联级
      schemasItem.component = 'AreaCascader';
      schemasItem.componentProps.labelField = 'text';
      schemasItem.componentProps.valueField = 'id';
      schemasItem.componentProps.asyncFetchParamKey = 'id';
      break;
    case 'address': // 地址选择
      schemasItem.component = 'ListSelect';
      break;
    case 'sel_depart': // 系统部门
      // schemasItem.component = 'DepartSelect';
      break;
    case 'hidden': // 隐藏
      break;
    case 'time': // 时间选择
      schemasItem.component = 'DatePicker';
      schemasItem.itemProps.isLink = true;
      schemasItem.componentProps.type = 'time';
      break;
    case 'date': // 日期选择
      schemasItem.component = 'DatePicker';
      schemasItem.itemProps.isLink = true;
      break;
    case 'datetime': // 日期时间选择
      schemasItem.component = 'DatePicker';
      schemasItem.itemProps.isLink = true;
      schemasItem.componentProps.type = 'datetime';
      schemasItem.componentProps.format = 'YYYY-MM-DD HH:mm';
      break;
    case 'popup': // 弹窗
      schemasItem.component = 'ListSelect';
      break;
    case 'list': // 下拉框
      schemasItem.component = 'ApiSelect';
      schemasItem.componentProps.options = items.enum;
      schemasItem.componentProps.labelField = 'text';
      schemasItem.componentProps.valueField = 'value';
      break;
    case 'list_multi': // 下拉多选
      schemasItem.component = 'ApiSelectMulti';
      schemasItem.componentProps.options = items.enum;
      schemasItem.componentProps.labelField = 'text';
      schemasItem.componentProps.valueField = 'value';
      break;
    case 'sel_search': // 下拉搜索
      break;
    case 'sel_user': //  用户选择
      schemasItem.component = 'DepartByUser';
      // schemasItem.defaultValue = '1456540805273161730,1456870518801813506';
      
      break;
    // case 'cat_tree': // 分类字典树
    //   schemasItem.component = 'classifyTree';

    //   break;
    case 'number': // 数字类型
      schemasItem.component = 'InputNumber';
      break;
    case 'radio': // 单选框
      schemasItem.component = 'ApiRadioGroup';
      break;
    case 'image': // 图片上传
      schemasItem.component = 'Upload';
      // schemasItem.defaultValue = 'icon5_1640053995543.png,icon5_1640054005034.png';
      break;
    case 'file': // 文件上传
      schemasItem.component = 'UploadFile';
      // schemasItem.defaultValue = 'temp/icon5_1640049442300.png,temp/icon5_1640049472680.png';
      break;
    case 'textarea': // 多行文本框
      schemasItem.component = 'InputTextArea';
      break;
    case 'InputCalendar': // 日历
      schemasItem.component = 'InputCalendar';
      // schemasItem.defaultValue = ['2021-12-28'];
      break;
    default:
      break;
  }
  return schemasItem;
}
