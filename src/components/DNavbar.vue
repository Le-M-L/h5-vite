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
    <template #title
      ><span class="nav-bar-title">{{ title }}</span>
    </template>
    <template #right>
      <Icon name="search" color="#666666" @click="handleSearch" size="20" />
    </template>
  </NavBar>
</template>

<script>
import { ref } from 'vue';
import { NavBar, Icon } from 'vant';
import {  useRoute } from "vue-router"
export default {
  components: {
    NavBar,
    Icon,
  },
  emits: ['click-left', 'click-right', 'search'],
  setup(_, { emit }) {
    const title = ref('11');
    const route = useRoute()
    console.log(route)
    // 点击左边返回触发
    const onClickLeft = () => history.back();
    const onClickRight = () => emit('click-right');
    const handleSearch = () => emit('search');
    return {
      onClickLeft,
      onClickRight,
      handleSearch,
      title,
    };
  },
};
</script>

<style>
</style>