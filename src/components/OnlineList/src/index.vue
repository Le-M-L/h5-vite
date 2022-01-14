<template>
  <DNavbar @search="handleSearch" />

  <BaseListHeader
    v-if="queryColumns.length"
    @change="handleChange"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
    :code="getCode"
  />
  <BaseList
    @register="register"
    :code="getCode"
    :rawColumns="rawColumns"
    :columns="columns"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
  />

  <div class="baseAdd" @click="handleAdd"></div>
</template>

<script>
import { computed, onMounted, ref, unref } from 'vue';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
import { useTable } from './hooks/useTable';
import { useRoute, useRouter } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import DNavbar from '@/components/DNavbar.vue';
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '标题',
    },
    code: {
      type: String,
      default: '',
    },
  },
  components: { BaseList, BaseListHeader, DNavbar },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { code } = route.params;
    const { isErp } = route.meta;
    // 在线开发 全局状态
    const onlineStore = useOnlineStoreWithOut();
    const dictOptions = ref({}); // 字典表
    const rawColumns = ref([]); // 行配置 源
    const columns = ref([]);
    const queryColumns = ref([]); // 查询 配置
    // 注册table
    const [register, { onReset }] = useTable();

    const getCode = computed(() => props.code || code);

    const handleChange = (values) => {
      onReset(values);
    };

    // 添加
    const handleAdd = () => {
      router.push(`/online/form/${unref(getCode)}`);
    };

    // 获取列表配置
    const getColumns = () => {
      return new Promise(async (r, j) => {
        r(
          isErp
            ? await onlineStore.setOnlineErpColumns(unref(getCode))
            : await onlineStore.setOnlineColumns(unref(getCode)),
        );
      });
    };

    Promise.all([getColumns(), onlineStore.setOnlineQueryColumns(unref(getCode))]).then(
      ([res, query]) => {
        // 获取列表配置
        columns.value = [
          {
            children: res?.columns?.slice(0, 2),
          },
          {
            children: res?.columns?.slice(2, 4),
          },
        ];
        dictOptions.value = res.dictOptions;
        rawColumns.value = res.columns;
        // 获取列表 查询配置
        queryColumns.value = query;
        console.log(queryColumns.value)
      },
    );

    // 查询
    const handleSearch = (val) => {
      onReset({
        title: val,
      });
    };

    onMounted(() => {
      onlineStore.setOnlineCfg({ code: unref(getCode) });
    });

    return {
      register,
      handleChange,
      dictOptions,
      rawColumns,
      columns,
      queryColumns,
      handleAdd,
      getCode,
      handleSearch,
    };
  },
};
</script>

<style scoped lang="less" >
.nav-bar-title {
  font-weight: 500;
  color: #333;
  font-size: 18px;
}
.baseAdd {
  position: fixed;
  right: 0;
  bottom: 90px;
  width: 64px;
  height: 64px;
  background: url('../../../assets/images/list_icon_add.png') no-repeat center center;
  background-size: 100% 100%;
}
</style> 