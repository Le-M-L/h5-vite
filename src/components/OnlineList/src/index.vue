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
    :code="code"
  />
  <BaseList
    @register="register"
    :code="code"
    :rawColumns="rawColumns"
    :columns="columns"
    :queryColumns="queryColumns"
    :dictOptions="dictOptions"
  />

  <div class="baseAdd" @click="handleAdd" ></div>
</template>

<script>
import { onMounted, ref, unref } from 'vue';
import { NavBar, Icon } from 'vant';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
import { getListColumns, getQueryColumns } from '@/api/sys/api';
import { useTable } from './hooks/useTable';
import { useRoute, useRouter } from "vue-router"
import { useOnlineStoreWithOut } from "@/store/modules/online"
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
    const route = useRoute();
    const router = useRouter()
    const { code } = route.params;
    // 在线开发 全局状态
    const onlineStore = useOnlineStoreWithOut();
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

    // 添加
    const handleAdd = () => {
      router.push(`/online/form/${code}`)
    }

    Promise.all([getListColumns({ code: unref(code) }), getQueryColumns(unref(code))]).then(
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

    onMounted(() => {
      onlineStore.setOnlineCode(code)
    })

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
      handleAdd,
      code,
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
.baseAdd{
  position: fixed;
  right: 0;
  bottom: 90px;
  width: 64px;
  height: 64px;
  background: url('../../../assets/images/list_icon_add.png') no-repeat center center;
  background-size: 100% 100%;
}
</style> 