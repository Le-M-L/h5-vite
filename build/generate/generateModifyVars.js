import { resolve } from 'path';
/**
 * less 全局 变量 设置
 */
 export function generateModifyVars(dark = false) {

    return {
    hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color':'#0960bd'
    };
  }
  