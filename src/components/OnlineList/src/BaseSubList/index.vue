<template>
  <NavBar
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    fixed
    placeholder
    safe-area-inset-top
  >
    <template #title>
      <Search
        style="width: 70vw; padding-left: 12px"
        v-model="title"
        left-icon=""
        clearable
        placeholder="请输入搜索关键词"
      />
    </template>
    <template #right>
      <span style="color: #2f54eb; font-size: 16px" @click="handleSearch">搜索</span>
    </template>
  </NavBar>
  <Tabs v-model:active="active" :ellipsis="false" sticky animated>
    <Tab v-for="item in subList" :key="item.id" :title="getTitle(item.description)">
      <TabList :item="item" />
    </Tab>
  </Tabs>
</template>

<script>
import { ref, computed } from 'vue';
import { Tab, Tabs, NavBar, Icon, Search } from 'vant';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import TabList from './TabList.vue';
// erp 子集列表
export default {
  name: 'BaseSubList',
  components: {
    Tabs,
    Tab,
    NavBar,
    Icon,
    Search,
    TabList,
  },
  setup() {
    const onlineStore = useOnlineStoreWithOut();
    const active = ref('');
    const title = ref('');
    const subList = computed(() => onlineStore.getOnlineSubList);
    const getTitle = (title) => {
      let newArr = title.split('-');
      return newArr[newArr.length - 1];
    };
    const onClickLeft = () => history.back();
    const onClickRight = () => {};
    const handleSearch = () => {
      console.log(title.value);
    };

    return {
      active,
      subList,
      getTitle,
      onClickLeft,
      onClickRight,
      handleSearch,
      title,
    };
  },
};
</script>

<style lang="less" >
</style>