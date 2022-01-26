import { ref, reactive, unref, computed } from 'vue';
import { useAppStoreWithOut } from '@/store/modules/app';

// 获取表格请求参数
export function useTableParam({ main, immediate = true }) {
  const queryParam = ref({});
  const foreignValues = ref({})
  const isorter = reactive({ column: 'id', order: 'desc' });
  const appStore = useAppStoreWithOut();
  const getRowData = computed(() => appStore.getRowData);
  
  const getQueryParam = computed(() => unref(queryParam));

  // 初始化 查询参数
  function initDependQueryParam() {
    const { tableType, foreignKeys } = main;
    if (3 == tableType) {
      if (!tableType || 0 == tableType) {
        createMessage.fail(`子表【${description}】外键配置未找到!`);
        return false;
      }
      if (!getRowData.value) return false;
      for (let item of foreignKeys) {
        if (!getRowData.value[item.key] || 0 == getRowData.value[item.key].length) return false;
        let obj = Object.assign({}, unref(queryParam));
        obj[item.field] = getRowData.value[item.key];
        obj['tabletype'] = tableType;
        // 保存参数
        foreignValues.value[item.field] = getRowData.value[item.key];
        queryParam.value = Object.assign({}, obj, unref(isorter));
      }
    }
    return true;
  }

  immediate && initDependQueryParam()

  return {
    getQueryParam,
    foreignValues
  };
};
