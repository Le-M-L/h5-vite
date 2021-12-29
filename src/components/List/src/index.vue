<template>
  <NavBar
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    fixed
    placeholder
  >
    <template #title
      ><span class="nav-bar-title" >{{ title }}</span>
    </template>
    <template #right>
      <Icon name="search" color="#666666" @click="handleSearch" size="20" />
    </template>
  </NavBar>
  <BaseListHeader />
  <BaseList  />
</template>

<script>
import { NavBar, Icon } from 'vant';
import BaseList from './BaseList.vue';
import BaseListHeader from './BaseListHeader.vue';
export default {
  inheritAttrs:false,
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
  components: { BaseList, BaseListHeader, NavBar, Icon },
  setup(props) {
    // 点击左边返回触发
    const onClickLeft = () => history.back();

    const onClickRight = () => {};
    console.log(props)
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

<style scoped lang="less" >
.nav-bar-title{
  font-weight: 500;
  color: #333;
  font-size: 18px;
}
</style> 