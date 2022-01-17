<template>
  <!-- <DNavbar title="记录" @search="handleSearch" /> -->
  <template v-if="subList.length > 1">
    <Tabs v-model:active="active" :ellipsis="false" sticky animated>
      <Tab v-for="item in subList" :key="item.id" :title="getTitle(item.description)">
        <TabList :main="item" />
      </Tab>
    </Tabs>
  </template>
  <TabList else :main="subList[0]" />
</template>

<script>
import { ref, computed } from 'vue';
import { Tab, Tabs, NavBar, Icon, Search } from 'vant';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import TabList from './TabList.vue';
import DNavbar from '@/components/DNavbar.vue';
// erp 子集列表
export default {
  name: 'CgformErpSubList',
  components: {
    Tabs,
    Tab,
    NavBar,
    Icon,
    Search,
    TabList,
    DNavbar,
  },
  setup() {
    const onlineStore = useOnlineStoreWithOut();
    const active = ref('');
    const subList = computed(() => onlineStore.getOnlineSubList);
    const getTitle = (title) => {
      let newArr = title.split('-');
      return newArr[newArr.length - 1];
    };
    const onClickLeft = () => history.back();
    const onClickRight = () => {};
    const handleSearch = (val) => {
      console.log(val);
    };

    return {
      active,
      subList,
      getTitle,
      onClickLeft,
      onClickRight,
      handleSearch,
    };
  },
};
</script>

<style lang="less" >
</style>