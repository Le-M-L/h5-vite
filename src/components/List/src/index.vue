<template>
  <NavBar
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    fixed
    placeholder
  >
    <template #title
      ><span class="nav-bar-title">{{ title }}</span>
    </template>
    <template #right>
      <Icon name="search" color="#666666" @click="handleSearch" size="20" />
    </template>
  </NavBar>
  <BaseListHeader
    @change="handleChange"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
    :id="id"
  />
  <BaseList
    @register="register"
    :id="id"
    :rawColumns="rawColumns"
    :columns="columns"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
  />
</template>

<script>
import { ref, unref } from 'vue';
import { NavBar, Icon } from 'vant';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
import { getListColumns, getQueryColumns } from '@/api/sys/api';
import { useTable } from './hooks/useTable';
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
  components: { BaseList, BaseListHeader, NavBar, Icon },
  setup(props) {
    const id = ref('33305b71c08d4b42a7b86326dfe2bb4c');
    const dictOptions = ref({}); // 字典表
    const rawColumns = ref([]); // 行配置 源
    const columns = ref([]);
    const queryColumns = ref([]); // 查询 配置
    // 点击左边返回触发
    const onClickLeft = () => history.back();
    // 注册table
    const [register, { onReset }] = useTable();

    const onClickRight = () => {};
    // 查询
    const handleSearch = () => {};
    const handleChange = (values) => {
      onReset(values);
    };

    Promise.all([getListColumns({ id: unref(id) }), getQueryColumns(unref(id))]).then(
      ([res, query]) => {
        // 获取列表配置
        columns.value = [
          {
            children: res.columns.slice(0, 2),
          },
          {
            children: res.columns.slice(2, 4),
          },
        ];
        dictOptions.value = res.dictOptions;
        rawColumns.value = res.columns;
        // 获取列表 查询配置
        queryColumns.value = query;
      },
    );

    return {
      register,
      onClickLeft,
      onClickRight,
      handleSearch,
      handleChange,
      dictOptions,
      rawColumns,
      columns,
      queryColumns,
      id,
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