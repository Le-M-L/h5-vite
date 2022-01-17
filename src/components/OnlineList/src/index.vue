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
import { useColumns } from './hooks/useColumns';

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
    const { isErp } = route.meta;
    // 在线开发 全局状态
    const onlineStore = useOnlineStoreWithOut();
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

    const { dictOptions, columns, rawColumns, getOnlineQueryColumns } = useColumns({
      code: getCode.value,
    });

    // 获取列表配置

    // 获取查询配置
    getOnlineQueryColumns().then((res) => {
      queryColumns.value = res;
    });

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