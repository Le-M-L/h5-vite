<template>
  <!-- <BaseListHeader :queryColumns="queryColumns" :dictOptions="dictOptions" /> -->
  <BaseList
    :code="code"
    :main="main"
    :columns="columns"
    :dictOptions="dictOptions"
    :params="getQueryParam"
    @row-click="onRowClick"
  />
</template>

<script>
import { ref, unref, computed, onMounted, toRefs, reactive } from 'vue';
import { PullRefresh } from 'vant';
import BaseList from '../BaseList.vue';
import BaseListHeader from '../BaseListHeader.vue';
import { useColumns } from '../hooks/useColumns';
import { useTableParam } from '../hooks/useTableParam';
import { useRouter } from "vue-router"
export default {
  components: {
    PullRefresh,
    BaseList,
    BaseListHeader,
  },
  props: {
    main: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { expose }) {
    const refreshing = ref(false);
    const loading = ref(false);
    const router = useRouter()
    const { code } = toRefs(props.main);

    const { getQueryParam } = useTableParam({ main: props.main,immediate:true });
    const { dictOptions, columns, rawColumns, queryColumns } = useColumns({
      code: unref(code),
      main: props.main,
      immediate: false,
      queryImmediate: true,
    });

    // relationType
    // checkboxFlag 多选
    // cgButtonList // 当前按钮
    // enhanceJs 自定义js
    // hideColumns 按钮隐藏配置
    // columns 表单列配置

    // 获取查询配置

    const total = ref(0);
    const list = ref([]);
    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
    };

    const onRowClick = (item) => {
       router.push(`/online/detail/${unref(code)}/${item.id}`);
    };

    onMounted(() => {
      // getListData(unref(code), {
      //   tableType: unref(tableType),
      //   // basic_population_id,
      // }).then((res) => {
      //   total.value = res.total;
      //   list.value = res.records;
      // });
      // loadData();
    });
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