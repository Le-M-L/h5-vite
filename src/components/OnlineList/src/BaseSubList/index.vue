<template>
  <DNavbar :title="title" @search="handleSearch" />
  <template v-if="subList.length > 1">
    <Tabs v-model:active="active" :ellipsis="false" animated @click-tab="onClickTab">
      <Tab v-for="item in subList" :key="item.id" :title="getTitle(item.description)">
        <TabList :main="item" />
      </Tab>
    </Tabs>
  </template>
  <TabList v-else-if="subList.length" :main="subList[0]" />
  <div class="base-add" @click="handleAdd"></div>
</template>

<script>
import { ref, unref, computed } from 'vue';
import { Tab, Tabs, NavBar, Icon, Search } from 'vant';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import TabList from './TabList.vue';
import DNavbar from '@/components/DNavbar.vue'; 
import { useRouter } from "vue-router"
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
    const active = ref(0);
    const title = ref('记录');
    const router = useRouter()
    const subList = computed(() => onlineStore.getOnlineSubList);
    // 当前选中
    const currentSub = computed(() => subList.value[active.value]);
    const getTitle = (title) => {
      let newArr = title.split('-');
      return newArr[newArr.length - 1];
    };
    const onClickLeft = () => history.back();
    const onClickRight = () => {};
    // 新增
    const handleAdd = (data) => {
       router.push(`/online/form/${unref(currentSub).code}`);
    }
    const handleSearch = (val) => {
      console.log(val);
    };

    // 设置第一个title
    if (unref(subList).length > 0) {
      title.value = getTitle(unref(subList)[0].description);
    }
    // 点击切换title
    const onClickTab = (data) => {
      title.value = data.title;
    };

    return {
      active,
      subList,
      getTitle,
      onClickLeft,
      onClickRight,
      handleSearch,
      onClickTab,
      handleAdd,
      title,
    };
  },
};
</script>

<style lang="less" >
</style>