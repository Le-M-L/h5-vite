import { unref } from 'vue';

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
          schemasItem.placeholder = '请选择'
          schemasItem.component = 'DSelect';
          schemasItem.options = dictOptions[next.field] || [];
          break;
        case 'text':
          schemasItem.component = 'DCalendar';
          schemasItem.type="range"
          schemasItem.placeholder = '请选择日期'
        break;
        default:
          break;
      }
      prev.push(schemasItem);
    }
    return prev;
  }, []);
  return schemas;
};
