<template>
  <PullRefresh
    style="overflow-y: scroll; height: calc(100% - 90px)"
    v-model="refreshing"
    @refresh="onRefresh"
    >123
  </PullRefresh>
</template>

<script>
import { ref, unref, computed, onMounted, toRefs } from 'vue';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { PullRefresh } from 'vant';
import { getListData } from "@/api/sys/api"
export default {
  components: {
    PullRefresh,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const onlineStore = useOnlineStoreWithOut();
    const refreshing = ref(false);
    const loading = ref(false);
    const { code } = toRefs(props.item);
    const total = ref(0);
    const list = ref([]);
    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
    };
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
    };
  },
};
</script>

<style>
</style>