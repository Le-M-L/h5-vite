import { watchEffect, ref, unref, onMounted } from 'vue';
import { useTimeoutFn } from "@vueuse/core"

export function useDataSource(propsRef, { listData }) {
  const dataSourceRef = ref([]);
  const rawDataSourceRef = ref([]);

  watchEffect(() => {
    listData.value = unref(dataSourceRef);
  });

  async function fetch(opt) {
      // const 
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {};
}
