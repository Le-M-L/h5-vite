export const basicProps = {
  api: {
    type: Function,
    default: null,
  },
  // 初始化参数
  initFetchParams: {
    type: [Object, String],
    default: () => ({}),
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  // 数字转字符串
  numberToString: {
    type: Boolean,
  },
  resultField: {
    type: String,
    default: 'result',
  },
  // 自定义label 字段
  labelField: {
    type: String,
    default: 'label',
  },
  // 自定义value 字段
  valueField: {
    type: String,
    default: 'value',
  },
  // 自定义children 字段
  childField: {
    type: String,
    default: 'children',
  },
  // 获取下一次数据 参数
  asyncFetchParamKey:{
    type:String,
    default:''
  },
  // 自定义字段对象
  fieldNames: {
    type: Object,
    default: () => ({}),
  },
  // 是否显示关闭图标
  closeable: {
    type: Boolean,
    default: true,
  },
  // 选中状态高亮颜色
  activeColor: {
    type: String,
    default: '#ee0a24',
  },
  // 未选中时的提示文案
  placeholder: {
    type: String,
    default: '请选择',
  },
  // 可选择的数据源
  options: {
    type: Array,
    default: () => [],
  },
  // 顶部标题
  title: {
    type: String,
    default: '',
  },
  // 是否有下级
  isLeaf:{
    type: Function,
    default:null
  },
  immediate: {
    type: Boolean,
    default: true,
  },
};
