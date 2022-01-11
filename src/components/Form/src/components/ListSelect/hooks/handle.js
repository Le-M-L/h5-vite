export const formatSchemas = (query = [], dictOptions) => {
  let schemas = query.reduce((prev, next, index) => {
    if (next) {
      const schemasItem = {
        field: next.field, // 字段
        dictCode: next.dictCode, // 是否为字段数据
        mode: next.mode, // 单选多选
        dictTable: next.dictTable, // 查询表格
        label: next.label, // 字段label
        inputProps: {
          clearable: true,
          'clear-trigger': 'always',
        },
        componentProps: {
          clearable: true,
          'clear-trigger': 'always',
        },
      };
      switch (next.view) {
        case 'list':
          schemasItem.inputProps.placeholder = '请选择' + next.label;
          schemasItem.component = 'ApiSelect';
          schemasItem.options = dictOptions[next.field] || [];
          break;
        case 'string':
          schemasItem.component = 'InputWidget';
          schemasItem.placeholder = '请输入' + next.label;
          break;
        case 'datetime':
          schemasItem.component = 'DatePicker';
          schemasItem.placeholder = '请选择' + next.label;
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
