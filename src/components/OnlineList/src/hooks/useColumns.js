import { ref, unref, computed, watchEffect } from 'vue';
import { getListColumns, getErpColumns, getQueryColumns } from '@/api/sys/api';
import { useRoute } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
// 获取配置
export function useColumns({
  code,
  main,
  immediate = true,
  cacheMain = false,
  queryImmediate = false,
}) {
  const route = useRoute();
  const { isErp } = route.meta;
  const mainRef = ref({});
  const subListRef = ref([]);
  const queryColumn = ref([]);
  const onlineStore = useOnlineStoreWithOut();

  // 行配置
  const columns = computed(() => {
    return [
      {
        children: getMainRef.value.columns?.slice(0, 2),
      },
      {
        children: getMainRef.value.columns?.slice(2, 4),
      },
    ];
  });
  // 总配置
  const getMainRef = computed(() => unref(main) || unref(mainRef));
  // 获取子集 配置
  const getSubListRef = computed(() => subListRef);
  // 行总配置
  const rawColumns = computed(() => unref(getMainRef).rawColumns);
  // 获取查询配置
  const queryColumns = computed(() => unref(queryColumn));
  // 字典数据
  const dictOptions = computed(() => unref(getMainRef).dictOptions);
  // 查询参数配置
  async function getOnlineQueryColumns(params) {
    queryColumn.value = await getQueryColumns(code, params);
  }

  // 获取列表配置
  async function getColumns() {
    if (isErp) {
      let data = await getErpColumns(code);
      mainRef.value = data.main;
      subListRef.value = data.subList;
      onlineStore.setOnlineCfg({ subList: unref(subListRef) });
    } else {
      mainRef.value = await getListColumns(code);
    }
    onlineStore.setOnlineCfg({ subList: unref(subListRef) });
    cacheMain && onlineStore.setOnlineCfg({ main: unref(mainRef) });
  }

  async function initColums() {
    immediate && getColumns();
    queryImmediate && getOnlineQueryColumns();
  }
  initColums();
  return {
    dictOptions,
    columns,
    rawColumns,
    queryColumns,
    getMainRef,
    getSubListRef
  };
}
