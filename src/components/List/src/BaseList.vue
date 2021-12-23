<template>
  <PullRefresh
    style="overflow-y: scroll; height: 100%"
    v-model="refreshing"
    @scroll="scroll"
    @refresh="onRefresh"
  >
    <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      error-text="加载失败，点击重新加载"
      @load="onLoad"
    >
      <Cell v-for="(item, i) in list" :key="i" :title="item" />
    </List>
  </PullRefresh>
</template>

<script>
import { ref } from 'vue';
import { PullRefresh, List, Cell } from 'vant';
export default {
  components: { PullRefresh, List, Cell },
  props: {},
  setup() {
    const loading = ref(false); // loading 加载
    const finished = ref(false); // 数据是否全部加载完成
    const refreshing = ref(false); // 下拉刷新
    const list = ref([]); // list 数据列表

    // 加载触发是方法
    const onLoad = () => {
      // 重新刷新
      if (refreshing.value) {
        list.value = [];
        refreshing.value = false;
      }
      for (let i = 0; i < 17; i++) {
        list.value.push(list.value.length + 1);
      }
      loading.value = false;
      if (list.value.length >= 40) {
        console.log(list);
        finished.value = true;
      }
    };

    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    const scroll = (val) => {
      console.log(val);
    };

    return {
      loading,
      finished,
      onLoad,
      list,
      refreshing,
      onRefresh,
      scroll,
    };
  },
};
</script>

<style>
</style>