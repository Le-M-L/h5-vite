<template>
   <BaseList :code="code"  />
</template>

<script>
import { ref, unref, computed, onMounted, toRefs } from 'vue';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { PullRefresh } from 'vant';
import { getListData } from "@/api/sys/api"
import {useTable, BaseList} from '@/components/OnlineList';
export default {
  components: {
    PullRefresh,
    BaseList
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props,{ expose}) {
    const onlineStore = useOnlineStoreWithOut();
    const refreshing = ref(false);
    const loading = ref(false);
    const { code, columns, dictOptions = {}, foreignKeys, tableType } = toRefs(props.item);
    const total = ref(0);
    const list = ref([]);
    const queryColumns = ref([]); //查询参数
  console.log(props.item)
    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
    };
    // 获取查询配置
     onlineStore.setOnlineQueryColumns(unref(code))
     .then(res =>{
       queryColumns.value = res;
     })
    onMounted(() => {
      getListData(unref(code))
      .then(res =>{
        total.value = res.total;
        list.value = res.records;
      })
    });
    return {
      refreshing,
      onRefresh,
      code
    };
  },
};
</script>

<style>
</style>