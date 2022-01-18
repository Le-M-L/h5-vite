import { watchEffect, ref, unref, onMounted } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { get, cloneDeep, merge } from 'lodash-es';

export function useDataSource(propsRef, { listData }) {
  const dataSourceRef = ref([]);
  const rawDataSourceRef = ref([]);
  const searchInfo = ref({
    pageNo: 1,
    pageSize: 10,
  });
  const extraParams = ref({})

  watchEffect(() => {
    listData.value = unref(dataSourceRef);
  });

  // 设置额外参数
  function setExtraParams(params){
    extraParams.value = params
  }

  async function fetch(opt) {
    const params = {
      ...unref(searchInfo),
      ...unref(extraParams)
    }
  }
  

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {
    setExtraParams
  };
}
