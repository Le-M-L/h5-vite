<template>
  <Field v-bind="getAttrs" readonly v-model="fieldValue" @click="handlePopup" />
  <Popup
    v-model:show="show"
    :style="{ height: '70%' }"
    safe-area-inset-bottom
    round
    position="bottom"
    @opened="scroll"
    @close="handleClose"
  >
    <div v-if="isFlexd" class="listSelectPerch"></div>
    <div class="listSelect" :class="{ isFlexd: isFlexd }">
      <Search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </Search>
      <div class="listSelect-gather" style="line-height: 45px"> 采集总数 <span>100 条</span> </div>
    </div>
    <PullRefresh ref="container" v-model="refreshing" @refresh="onRefresh">
      <List
        v-model="loading"
        @scroll="scroll"
        finished-text="没有更多了"
        :finished="finished"
        @load="onLoad"
      >
        <Cell @click="handleClick(item)" v-for="item in list" :key="item.id" :title="item.name">
          <template #right-icon>
            <Icon v-if="state == item.id" name="success" />
          </template>
        </Cell>
      </List>
    </PullRefresh>
  </Popup>
</template>

<script>
import { computed, onMounted, ref, unref } from 'vue';
import { List, Cell, Popup, Field, Search, PullRefresh, Sticky, Icon } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { getPopupColumns, getPopupData, getPopupQuery } from '@/api/sys/api';
export default {
  name: 'ListSelect',
  inheritAttrs: false,
  components: {
    List,
    Popup,
    Field,
    Cell,
    PullRefresh,
    Sticky,
    Search,
    Icon,
  },
  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const [state] = useRuleFormItem(props);
    const container = ref(null);
    const isFlexd = ref(false);
    const show = ref(false);
    const fieldValue = ref('');
    const finished = ref(false); // true 数据加载完成
    const refreshing = ref(false); // 下拉刷新 是否处于加载中
    const loading = ref(false); // 列表 是否处于加载中
    const list = ref([]);
    const value = ref('');
    const columns = ref([]); //列表配置

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
      };
    });

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    // 滚动条与底部距离小于 offset 时触发
    function onLoad() {
      if (refreshing.value) {
        list.value = [];
        refreshing.value = false;
      }

      for (let i = 0; i < 15; i++) {
        list.value.push({
          id: list.value.length + 1,
          name: list.value.length + 1,
        });
      }
      loading.value = false;

      if (list.value.length >= 40) {
        // 数据加载完成
        finished.value = true;
      }
    }

    const scroll = (e) => {
      setTimeout(() => {
        isFlexd.value = true;
      }, 200);
    };

    // 搜索
    const onSearch = () => {};

    const handleClose = () => {
      isFlexd.value = false;
    };

    const handleClick = (items) => {
      fieldValue.value = items.name;
      emit('change', items.id);
      show.value = false;
      finished.value = false;
      loading.value = true;
    };

    const handlePopup = async () => {
      const { code } = unref(getAttrs);
      let { cgRpConfigId, columns, dictOptions } = await getPopupColumns({ code });
      Promise.all([getPopupQuery({code:cgRpConfigId}),getPopupData({code:cgRpConfigId})])
        .then(res => {
      console.log(res)          
        })
        .catch((err) => {
          console.error(err)
        })        
      show.value = true;
    };

    //

    return {
      state,
      show,
      fieldValue,
      getAttrs,
      getBindValue,
      finished,
      list,
      loading, // 列表 是否处于加载中
      refreshing, // 下拉刷新 是否处于加载中
      onRefresh,
      onLoad,
      value,
      handleClose,
      container,
      isFlexd,
      scroll,
      onSearch,
      handleClick,
      handlePopup,
    };
  },
};
</script>

<style  scoped lang="less" >
@header: 100px;
.listSelectPerch {
  height: @header;
}
.listSelect {
  width: 100%;
  height: @header;
  border-radius: var(--van-popup-round-border-radius) var(--van-popup-round-border-radius) 0 0;
  overflow: hidden;
  &-gather {
    background: #f6f7f9;
    line-height: 45px;
    padding: 0 16px;
    color: #999;
    font-size: 14px;
    span {
      color: #333;
    }
  }
}
.isFlexd {
  position: fixed;
  bottom: calc(70% - @header);
  z-index: 1;
}
</style>