<template>
  <!-- <BaseListHeader :queryColumns="queryColumns" :dictOptions="dictOptions" /> -->
  <BaseList
    :code="code"
    :columns="columns"
    :dictOptions="dictOptions"
    :params="getQueryParam"
    @row-click="onRowClick"
  />
</template>

<script>
import { ref, unref,  toRefs } from 'vue';
import BaseList from '../BaseList.vue';
import BaseListHeader from '../BaseListHeader.vue';
import { useColumns } from '../hooks/useColumns';
import { useTableParam } from '../hooks/useTableParam';
import { useRouter } from "vue-router"
export default {
  components: {
    BaseList,
    BaseListHeader,
  },
  props: {
    main: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const refreshing = ref(false);
    const loading = ref(false);
    const router = useRouter()
    const { code } = toRefs(props.main);

    const { getQueryParam } = useTableParam({ main: props.main,immediate:true });
    const { dictOptions, columns, queryColumns } = useColumns({
      code: unref(code),
      main: props.main,
      immediate: false,
      queryImmediate: true,
    });

    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
    };

    const onRowClick = (item) => {
       router.push(`/online/subDetail/${unref(code)}/${item.id}`);
    };

    return {
      refreshing,
      onRefresh,
      columns,
      dictOptions,
      code,
      onRowClick,
      getQueryParam,
      queryColumns,
    };
  },
};
</script>

<style>
</style>