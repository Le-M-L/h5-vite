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
    :dictOptions="dictOptions"
    @row-click="onRowClick"
  />

  <div class="base-add" @click="handleAdd"></div>
</template>

<script>
import { computed, onMounted, ref, unref } from 'vue';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
import { useTable } from './hooks/useTable';
import { useRoute, useRouter } from 'vue-router';
import DNavbar from '@/components/DNavbar.vue';
import { useColumns } from './hooks/useColumns';
import { useAppStoreWithOut } from '@/store/modules/app';
export default {
  name: 'CgformListPage',
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
    const appStore = useAppStoreWithOut();
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

    const { dictOptions, columns, rawColumns, queryColumns } = useColumns({
      code: getCode.value,
      queryImmediate: true,
      cacheMain:true
    });
    // 查询
    const handleSearch = (val) => {
      onReset({
        title: val,
      });
    };

    const onRowClick = (item) => {
      appStore.setRowData(item);
      router.push(`/online/detail/${code}/${item.id}`);
    };

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
      onRowClick,
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
</style> 