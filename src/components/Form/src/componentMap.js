// 组件列表，在这里注册以在表单中设置它

import { Slider, Divider } from 'vant';
import ApiRadioGroup from './components/ApiRadioGroup.vue';
import ApiCheckboxGroup from './components/ApiCheckboxGroup.vue';
import InputNumber from './components/InputNumber.vue';
import InputTextArea from './components/InputTextArea.vue';
import ApiSelect from './components/ApiSelect.vue';
import InputWidget from './components/InputWidget.vue';
import DatePicker from './components/DatePicker.vue';
import ApiCascader from './components/ApiCascader.vue';
import AreaCascader from './components/AreaCascader.vue';
import DepartSelect from './components/DepartSelect.vue';
import ListSelect from './components/ListSelect.vue';
import InputUpload from './components/InputUpload.vue';
import UploadFile from './components/UploadFile.vue';
import InputSwitch from './components/InputSwitch.vue';
import InpuRate from './components/InpuRate.vue';
import { GaodeMap } from '@/components/Map';
const componentMap = new Map();

// 输入框
componentMap.set('Input', InputWidget);
componentMap.set('Switch', InputSwitch);
componentMap.set('Rate', InpuRate);
componentMap.set('Slider', Slider);
componentMap.set('Divider', Divider);
componentMap.set('DatePicker', DatePicker);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('ApiCheckboxGroup', ApiCheckboxGroup);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('ApiCascader', ApiCascader);
componentMap.set('AreaCascader', AreaCascader);
componentMap.set('DepartSelect', DepartSelect);
componentMap.set('ListSelect', ListSelect);
componentMap.set('InputNumber', InputNumber);
componentMap.set('InputTextArea', InputTextArea);
componentMap.set('Upload', InputUpload);
componentMap.set('UploadFile', UploadFile);
componentMap.set('GaodeMap', GaodeMap);

export { componentMap };
