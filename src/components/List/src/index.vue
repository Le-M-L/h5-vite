<template>
  <NavBar
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    fixed
    placeholder
  >
    <template #right>
      <Icon name="search" @click="handleSearch" size="18" />
    </template>
  </NavBar>
  <BaseListHeader />
  <BaseList />
</template>

<script>
import { NavBar, Icon } from 'vant';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
export default {
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
  components: { BaseList, BaseListHeader, NavBar, Icon },
  setup() {
    // 点击左边返回触发
    const onClickLeft = () => history.back();

    const onClickRight = () => {};

    // 查询
    const handleSearch = () => {};
    return {
      onClickLeft,
      onClickRight,
      handleSearch,
    };
  },
};
</script>

<style>
</style> 