<template>
  <DNavbar @click="handleClick">
    <template #title>
      <Search
        class="nav-search"
        v-model:modelValue="searchValue"
        clearable
        placeholder="请输入搜索关键词"
        @focus="onFocus"
      />
    </template>
  </DNavbar>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Search } from 'vant';
import DNavbar from './index.vue';
export default {
  name: 'searchNav',
  components: { DNavbar, Search },
  emits: ['search', 'focus'],
  setup(_, { emit }) {
    const searchValue = ref('');

    const handleClick = (val) => {
      emit('search', { value: searchValue.value, ...val });
    };

    const onFocus = (val) => emit('focus');

    const setFieldsValue = (val) => {
      searchValue.value = val;
    };

    const actionType = {
      setFieldsValue,
    };

    onMounted(() => {
      emit('register', actionType);
    });

    return {
      onFocus,
      searchValue,
      handleClick,
    };
  },
};
</script>

<style lang="less" scoped >
.nav-search {
  width: 60vw;
  padding: 4px 0;
  .van-search__content.van-search__content--square {
    width: 60vw;
  }
}
</style>