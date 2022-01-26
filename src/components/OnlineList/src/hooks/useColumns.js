import { ref, unref, computed, watch } from 'vue';
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
  // const listConfig = ref([]); // 列表指定展示字段配置
  // const queryConfig = ref([]); // 指定查询展示字段配置

  // 总配置
  const getMainRef = computed(() => unref(main) || unref(mainRef));
  // 获取子集 配置
  const getSubListRef = computed(() => subListRef);
  // 行总配置
  const rawColumns = computed(() => unref(getMainRef).rawColumns);

  // 字典数据
  const dictOptions = computed(() => unref(getMainRef).dictOptions);
  // js增强 列表字段配置 和 查询字段配置
  const enhanceJs = computed(() => {
    let Obj = eval('(' + unref(getMainRef).enhanceJs + ')');
    const { listConfig = [], queryConfig = [] } = (Obj && new Obj().getAppConfig?.()) || {};
    return {
      listConfig,
      queryConfig,
    };
  });

  // 行配置
  const columns = computed(() => {
    let list = [];
    let columns = getMainRef.value.columns || [];
    let listConfig = enhanceJs.value.listConfig;
    for (let i = 0; i < listConfig.length; i++) {
      let items = columns.find((item) => item.dataIndex == listConfig[i].field);
      list.push(items || {});
    }

    return [
      {
        children: list?.slice(0, 2),
      },
      {
        children: list?.slice(2, 4),
      },
    ];
  });

  // 按钮配置
  const btnColumns = computed(() => {
    let columns = unref(getMainRef).hideColumns || [];
    if (columns.includes('delete')) {
      return [
        {
          code: 'delete',
          type: 'danger',
          text: '删除',
        },
      ];
    }
    return [];
  });

  // 查询配置
  const queryColumns = computed(() => {
    let queryConfig = enhanceJs.value.queryConfig;
    let list = [];
    let columns = unref(queryColumn) || [];
    for (let i = 0; i < queryConfig.length; i++) {
      let items = columns.find((item) => item.field == queryConfig[i].field);
      items && list.push(items);
    }
    return list;
  });

  // 搜索字段配置
  const searchColumns = computed(() => {
    let queryConfig = enhanceJs.value.queryConfig;
    return queryConfig.find(item => item.sign == 'search') || {}
  })

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
    searchColumns,
    getMainRef,
    getSubListRef,
    enhanceJs,
    btnColumns,
  };
}
