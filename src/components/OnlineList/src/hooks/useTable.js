import { ref, unref, onUnmounted } from 'vue';
import { error } from '@/utils/log';
import { isProdMode } from '@/utils/env';

// 对数据进行处理
export const handleItem = (item, columns, dictOptions) => {
  if (columns.customRender) {
    let currentData = dictOptions[columns.customRender]?.find(
      (items) => items.value == item[columns.dataIndex],
    );
    return currentData?.text;
  }
  return item[columns.dataIndex];
};

// 对表格查询数据进行处理
const handleFormData = (form) => {};

//防止字典中有垃圾数据
export const initDictOptionData = (dictOptions) => {
  let obj = {};
  Object.keys(dictOptions).map((k) => {
    obj[k] = dictOptions[k].filter((item) => {
      return item != null;
    });
  });
  this.dictOptions = obj;
};

// 注册table  将table方法暴露出去
export const useTable = () => {
  const tableRef = ref(null);
  const loadedRef = ref(false);

  // 获取组件实例 为组件注册属性和方法
  async function getInstance() {
    const table = unref(tableRef);
    if (!table) {
      error('未获取到table组件实例，请确保table组件加载完成');
    }
    return table;
  }

  // table 注册
  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return;
    tableRef.value = instance;
    loadedRef.value = true;
  }

  const methods = {
    /**
     * 刷新列表
     */
    onReset: async (params) => {
      const instance = await getInstance();
      instance?.onReset(params);
    },
  };

  return [register, methods];
};
