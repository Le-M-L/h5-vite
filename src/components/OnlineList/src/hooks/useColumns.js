import { ref, unref, computed, onMounted } from 'vue';
import { getListColumns, getErpColumns, getQueryColumns } from '@/api/sys/api';
import { useRoute } from 'vue-router';
// 获取配置
export const useColumns = ({ code, main, immediate = true }) => {
  const route = useRoute();
  const { isErp } = route.meta;
  const mainRef = ref({});
  const subListRef = ref([]);
  const querySchema = ref([]);

  // 总配置
  const getMainRef = computed(() => {
    return unref(main) || unref(mainRef);
  });

  // 字典数据
  const dictOptions = computed(() => {
    return unref(getMainRef).dictOptions;
  });

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
  // 行总配置
  const rawColumns = computed(() => {
    return unref(getMainRef).rawColumns;
  });


  const getQuerySchema = computed(() => querySchema);



  // 查询参数配置
  const getOnlineQueryColumns = async (params) => {
    let result = await getQueryColumns(code, params);
    return result;
  };

  // 获取列表配置
  async function getColumns() {
    if (isErp) {
      let data = await getErpColumns(code);
      mainRef.value = data.main;
      subListRef.value = data.subList;
    } else {
      mainRef.value = await getListColumns(code);
    }
  }

  immediate && getColumns()

  return {
    getOnlineQueryColumns,
    dictOptions,
    columns,
    rawColumns,
    getQuerySchema
  };
};
