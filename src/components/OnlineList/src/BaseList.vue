<template>
  <PullRefresh
    style="overflow-y: scroll; height: calc(100% - 102px)"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      error-text="加载失败，点击重新加载"
      @load="onLoad"
      :immediate-check="false"
      class="custom-list"
    >
      <Cell
        class="custom-list-item"
        @click="handleClick(item)"
        v-for="(item, i) in listData"
        :key="i"
      >
        <template #title>
          <!-- 左边图片 -->
          <Image class="custom-list-item-img" src="../">
            <template v-slot:loading>
              <Loading type="spinner" size="20" />
            </template>
            <template v-slot:error>
              <img
                style="width: 100%; height: 100%"
                src="../../../assets/images/pic_nopic.png"
                alt=""
              />
            </template>
          </Image>
          <!-- 右边内容 -->
          <div class="custom-list-item-content">
            <div v-for="(items, i) in columns" :key="i">
              <div v-for="child in items.children" :key="child.dataIndex">
                <span v-text="handleItem(item, child, dictOptions)"></span>
              </div>
            </div>
          </div>
        </template>
      </Cell>
    </List>
  </PullRefresh>
</template>

<script>
import { ref, unref, onMounted, reactive, computed } from 'vue';
import { PullRefresh, List, Cell, Image, Loading } from 'vant';
import {  getListData } from '@/api/sys/api';
import { useDebounceFn } from '@vueuse/core';
import { handleItem } from './hooks/useTable';
export default {
  components: { PullRefresh, List, Cell, Image, Loading },
  props: {
    code: {
      type: String,
      default: '',
    },
    rawColumns: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    dictOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['register'],
  setup(props, { emit }) {
    const form = reactive({
      pageNo: 0,
      pageSize: 10,
    });
    const extraParams = ref({});
    const loading = ref(false); // loading 加载
    const finished = ref(false); // 数据是否全部加载完成
    const refreshing = ref(false); // 下拉刷新
    const listData = ref([]); // listData 数据列表
    const total = ref(0);

    const listParams = computed(() => {
      return {
        ...unref(form),
        ...unref(extraParams),
      };
    });

    // 加载触发方法
    const onLoad = useDebounceFn((params = {}) => {
      // 重新刷新
      if (refreshing.value) {
        listData.value = [];
        form.pageNo = 0;
        refreshing.value = false;
      }
      loading.value = true;
      form.pageNo++;
      getListData(props.code, {
        ...unref(listParams),
      })
        .then(({ records, total: totals }) => {
          listData.value = listData.value.concat(records);
          total.value = totals;

          // 加载完毕
          if (listData.value.length >= total.value) {
            finished.value = true;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }, 80);

    // 清空数据 下拉刷新回调
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    // 重新加载列表数据
    const onReset = (params) => {
      extraParams.value = params;
      finished.value = false; // 清空列表数据
      loading.value = true; // 处于加载状态
      // 初始状态
      listData.value = [];
      form.pageNo = 0;
      onLoad();
    };

    // 点击列表触发
    const handleClick = (item) => {
      console.log(item);
    };

    const actionType = {
      onReset,
    };

    onMounted(() => {
      // 获取列表配置
      onRefresh();
      // 将内部方法返回出去
      emit('register', actionType);
    });

    return {
      loading,
      finished,
      onLoad,
      listData,
      refreshing,
      onRefresh,
      handleClick,
      handleItem,
    };
  },
};
</script>

<style lang="less" scoped >
.custom-list {
  &-item {
    height: 81px;
    padding: 12px 16px;
    margin-bottom: 1px;
    &::after {
      display: none;
    }
    ::v-deep .van-cell__title {
      display: flex;
    }
    &-img {
      width: 56px;
      height: 56px;
    }
    &-content {
      flex: 1;
      margin-left: 12px;
      color: #666666;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        display: flex;
        justify-content: space-between;
        > div {
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        &:nth-child(1) {
          > div:nth-child(1) {
            font-weight: 600;
            font-size: 16px;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > div:nth-child(2) {
            max-width: 90px;
            span {
              padding: 2px 8px;
              border-radius: 2px;
              color: #63ba4d;
              background: rgba(99, 186, 77, 0.1);
            }
          }
        }
        &:nth-child(2) {
          height: 20px;
          > div:nth-child(1) {
            max-width: 100px;
          }
          > div:nth-child(2) {
            max-width: 170px;
          }
        }
      }
    }
  }
}
</style>