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
      <span v-if="!isSearch" class="nav-bar-title">{{ navTitle }}</span>
      <Search
        v-else
        style="width:65vw;padding-left: 12px"
        v-model:modelValue="value"
        left-icon=""
        clearable
        placeholder="请输入搜索关键词"
      />
    </template>
    <template #right>
      <Icon v-if="!isSearch" name="search" color="#666666" @click="isSearch = true" size="20" />
      <span v-else style="color:#2F54EB" @click="handleSearch" >搜索</span>
    </template>
  </NavBar>
</template>

<script>
import { ref,computed } from 'vue';
import { NavBar, Icon, Search } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
export default {
  components: {
    NavBar,
    Icon,
    Search
  },
  props:{
    title:{
      type:String,
      default:''
    }
  },
  emits: ['click-left', 'click-right', 'search'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter()
    const value = ref('');
    const onlineStore = useOnlineStoreWithOut();
    const isSearch = ref(false)
    const navTitle =  computed(() => props.title || onlineStore.getOnlineTitle);

    // 点击左边返回触发
    const onClickLeft = () => router.back();
    const onClickRight = () => emit('click-right');
    const handleSearch = () => {
      emit('search',value.value)
    };

    return {
      onClickLeft,
      onClickRight,
      handleSearch,
      navTitle,
      isSearch,
      value
    };
  },
};
</script>

<style>
.van-nav-bar__title{
  max-width: 70%;
}
</style>