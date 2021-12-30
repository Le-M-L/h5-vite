import { unref } from 'vue';
import { formatMode } from '@/components/Form';

export const formatSchemas = (query = [], dictOptions) => {
  let schemas = unref(query).reduce((prev, next, index) => {
    if (next) {
      const schemasItem = {
        field: next.field, // 字段
        dictCode: next.dictCode, // 是否为字段数据
        mode: next.mode, // 单选多选
        dictTable: next.dictTable, // 查询表格
        label: next.label, // 字段label
      };
      if(index == 0 && next.view == 'list' || prev[0]?.sign == 'center'){
        schemasItem.sign = 'center';
      }
      switch (next.view) {
        case 'list':
          schemasItem.component = 'DSelect';
          schemasItem.options = dictOptions[next.field] || [];
          break;
        case 'text':
          schemasItem.component = 'DSelect';
          break;
        default:
          break;
      }
      prev.push(schemasItem);
    }
    return prev;
  }, []);
  console.log(schemas);
  return schemas;
};
