// 组件列表，在这里注册以在表单中设置它

import { Field, Switch, Rate, Slider,Divider } from 'vant';
import ApiRadioGroup from './components/ApiRadioGroup.vue';
import ApiCheckboxGroup from './components/ApiCheckboxGroup.vue';
import InputNumber from './components/InputNumber.vue';
import InputTextArea from './components/InputTextArea.vue';


const componentMap = new Map();

console.log(Field);
// 输入框
componentMap.set('Input', Field);
componentMap.set('Switch', Switch);
componentMap.set('Rate', Rate);
componentMap.set('Slider', Slider);
componentMap.set('Divider', Divider);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('ApiCheckboxGroup', ApiCheckboxGroup);
componentMap.set('InputNumber', InputNumber);
componentMap.set('InputTextArea', InputTextArea);


export { componentMap };