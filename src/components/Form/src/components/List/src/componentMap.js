// 组件列表，在这里注册以在表单中设置它

import { DSelect } from '@/components/DSelect';
import { DatePicker } from '@/components/DatePicker';
// import { DCalendar } from '@/components/DCalendar';
import InputWidget from '../../InputWidget.vue';
// import ApiSelect from '../ApiSelect.vue';

const componentMap = new Map();

componentMap.set('ApiSelect', DSelect);
componentMap.set('InputWidget', InputWidget);
componentMap.set('DatePicker', DatePicker);

export { componentMap };
