// 组件列表，在这里注册以在表单中设置它

import { Field, Switch, Rate, Slider, Divider } from 'vant';
import ApiRadioGroup from './components/ApiRadioGroup.vue';
import ApiCheckboxGroup from './components/ApiCheckboxGroup.vue';
import InputNumber from './components/InputNumber.vue';
import InputTextArea from './components/InputTextArea.vue';
import ApiSelect from './components/ApiSelect.vue';
import DatetimePicker from './components/DatetimePicker.vue';
import { BasicUpload } from '@/components/Upload';

const componentMap = new Map();

// 输入框
componentMap.set('Input', Field);
componentMap.set('Switch', Switch);
componentMap.set('Rate', Rate);
componentMap.set('Slider', Slider);
componentMap.set('Divider', Divider);
componentMap.set('DatetimePicker', DatetimePicker);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('ApiCheckboxGroup', ApiCheckboxGroup);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('InputNumber', InputNumber);
componentMap.set('InputTextArea', InputTextArea);
componentMap.set('Upload', BasicUpload);

export { componentMap };
