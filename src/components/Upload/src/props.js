import { uploadApi } from '@/api/sys/upload';
import { uploadFile } from '@/api/sys/upload';


export const basicProps = {
  modelValue:{
    type:[Array,String],
    default: () => []
  },
  initData:{
    type:[Array,String],
    default: () => []
  },
  // 文件最大多少MB
  maxSize: {
    type: [Number,String],
    default: 2,
  },
  // 最大数量的文件，Infinity不限制
  maxCount: {
    type: Number,
    default: Infinity,
  },
  // 是否自动上传
  autoUpload:{
    type:Boolean,
    default:true
  },
  // 根据后缀，或者其他
  accept: {
    type: String,
    default: null
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  uploadParams: {
    type: Object,
    default: {},
  },
   /*这个属性用于控制文件上传的业务路径*/
  bizPath: {
    type: String,
    required: false,
    default: null,
  },
  api: {
    type: Function,
    default: uploadFile,
  },
  name: {
    type: String,
    default: 'file',
  },
  filename: {
    type: String,
    default: null,
  },
};
