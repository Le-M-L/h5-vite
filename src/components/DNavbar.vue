<template>
  <NavBar
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
    safe-area-inset-top
  >
    <template #title>
      <!-- <Search
        style="width: 65vw; padding-left: 12px"
        v-model:modelValue="searchValue"
        left-icon=""
        clearable
        placeholder="请输入搜索关键词"
      /> -->
      <slot name="title">
        <span class="nav-bar-title">{{ navTitle }}</span>
      </slot>
    </template>
    <template #right>
      <slot name="right">
        <Icon
          v-if="btnFlag == 'list'"
          name="search"
          color="#666666"
          size="20"
          @click="handleClick"
        />
        <span v-else style="color: #2f54eb" @click="handleClick">{{ btnText }}</span>
      </slot>
    </template>
  </NavBar>
</template>

<script>
import { ref, computed } from 'vue';
import { NavBar, Icon, Search } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
export default {
  name: 'DNavbar',
  components: {
    NavBar,
    Icon,
    Search,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    btnFlag: {
      type: String,
      default: 'search',
    },
    btnText: {
      type: String,
      default: '搜索',
    },
  },
  emits: ['click-left', 'click-right', 'click'],
  setup(props, { emit }) {
    const router = useRouter();
    const searchValue = ref('');
    const onlineStore = useOnlineStoreWithOut();
    const navTitle = computed(() => props.title || onlineStore.getOnlineMainTitle);
    // 点击左边返回触发
    const onClickLeft = () => router.back();
    const handleClick = () => emit('click', { value: searchValue.value, flag: props.btnFlag });

    return {
      onClickLeft,
      handleClick,
      navTitle,
      searchValue,
    };
  },
};
</script>

<style>
.van-nav-bar__title {
  max-width: 70%;
}
</style>