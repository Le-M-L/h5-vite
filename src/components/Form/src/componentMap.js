// 组件列表 注册

import { Field, Switch  } from 'vant';

const componentMap = new Map();


// 输入框
componentMap.set('Input', Field);
componentMap.set('Switch', Switch);


export { componentMap };