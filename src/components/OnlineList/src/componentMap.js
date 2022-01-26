// 组件列表，在这里注册以在表单中设置它

import { DSelect } from '@/components/DSelect';
import { DCalendar } from '@/components/DCalendar';
import { DatePicker } from '@/components/DatePicker';
const componentMap = new Map();

componentMap.set('DSelect', DSelect);
componentMap.set('DCalendar', DCalendar);
componentMap.set('DatePicker', DatePicker);



export { componentMap };
