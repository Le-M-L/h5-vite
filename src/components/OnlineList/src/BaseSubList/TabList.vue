<template>
  <BaseList :code="code" :main="main" :columns="columns" :dictOptions="dictOptions" />
</template>

<script>
import { ref, unref, computed, onMounted, toRefs, reactive } from 'vue';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { PullRefresh } from 'vant';
import BaseList from '../BaseList.vue';
import { useMessage } from '@/hooks/web/useMessage';
import { useColumns } from '../hooks/useColumns';
import { useTableParam } from "./hooks/useTableParam"
export default {
  components: {
    PullRefresh,
    BaseList,
  },
  props: {
    main: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { expose }) {
    const onlineStore = useOnlineStoreWithOut();
    const refreshing = ref(false);
    const loading = ref(false);
    const { code } = toRefs(props.main);

    const {initDependQueryParam, getQueryParam } = useTableParam({main:props.main})

    const { dictOptions, columns, rawColumns, getOnlineQueryColumns } = useColumns({
      code: unref(code),
      main: props.main,
      immediate: false,
    });
    // relationType
    // checkboxFlag 多选
    // cgButtonList // 当前按钮
    // enhanceJs 自定义js
    // hideColumns 按钮隐藏配置
    // columns 表单列配置

    // 获取查询配置
    getOnlineQueryColumns().then((res) => {
      console.log(res);
    });

    const total = ref(0);
    const list = ref([]);
    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
    };

    const loadData = () => {};

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
    };
  },
};
</script>

<style>
</style>