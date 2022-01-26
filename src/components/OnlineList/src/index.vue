<template>
  <DNavbar @click="handleClick" btnFlag="list" />

  <BaseListHeader
    v-if="queryColumns.length"
    @change="onReset"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
    :code="getCode"
  />
  <BaseList
    @register="register"
    :code="getCode"
    :rawColumns="rawColumns"
    :columns="columns"
    :btnColumns="btnColumns"
    :dictOptions="dictOptions"
    @row-click="onRowClick"
    :existNav="!!queryColumns.length"
  />

  <div class="base-add" @click="handleAdd"></div>
</template>

<script>
import { computed, onMounted, ref, unref } from 'vue';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
import { useTable } from './hooks/useTable';
import { useRoute, useRouter } from 'vue-router';
import { DNavbar } from '@/components/DNavbar';
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

    const getCode = computed(() => props.code || code);

    // 注册table
    const [register, { onReset }] = useTable();

    // 获取列表配置
    const { dictOptions, columns, rawColumns, queryColumns, btnColumns } = useColumns({
      code: getCode.value,
      queryImmediate: true,
      cacheMain: true,
    });

    // 添加
    const handleAdd = () => router.push(`/online/form/${unref(getCode)}`);

    // 查询
    const handleClick = () => {
      router.push(`/online/search/${unref(getCode)}`);
    };

    const onRowClick = (item) => {
      appStore.setRowData(item);
      router.push(`/online/detail/${code}/${item.id}`);
    };

    return {
      register,
      onReset,
      dictOptions,
      rawColumns,
      btnColumns,
      columns,
      queryColumns,
      handleAdd,
      getCode,
      handleClick,
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