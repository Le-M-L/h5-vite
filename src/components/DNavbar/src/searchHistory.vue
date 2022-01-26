<template>
  <div class="search-history">
    <div class="search-history-header">
      <div class="search-history-header-left">搜索历史</div>
      <div @click="clearAll">
        <img src="/src/assets/icon/icon_line_shanchu.svg" />
        全部删除
      </div>
    </div>

    <div class="search-history-content">
      <div v-for="item in historys" :key="item" @click="handleClick(item)">{{ item }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAppStoreWithOut } from '@/store/modules/app';
// 搜索历史
export default {
  name: 'SearchHistory',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  emits: ['search'],
  setup(props, { emit }) {
    const appStore = useAppStoreWithOut();
    const historys = computed(() => appStore.getSearchRecord[props.code] || []);
    const handleClick = (val) => emit('search', {value:val});
    const clearAll = () => appStore.setSearchRecord({ code:props.code, flag: 'clearAll' });
    return {
      historys,
      handleClick,
      clearAll,
    };
  },
};
</script>

<style lang="less" >
.search-history {
  padding: 16px;
  &-header {
    display: flex;
    justify-content: space-between;
    &-left {
      font-weight: 500;
      font-size: 16px;
    }
    > div {
      display: flex;
      align-items: center;
    }
    img {
      width: 16px;
      height: 16px;
      margin-right: 1px;
    }
  }
  &-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    > div {
      padding: 5px 10px;
      background: #ededed;
      margin: 0 10px 10px 0;
      border-radius: 10px;
    }
  }
}
</style>
