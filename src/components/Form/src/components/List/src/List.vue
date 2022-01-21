<template>
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
      <div class="listSelect-search">
        <template v-for="item in getBindValue.queryColumns" :key="item.id">
          <div>
            <component
              :is="item.component + 1"
              v-bind="item"
              @change="handleChange"
              v-model="formModel[item.field]"
            />
          </div>
        </template>
      </div>

      <!-- <DropdownMenu>
          <DropdownItem v-model="value" :options="options" />
      </DropdownMenu> -->
      <!-- <Search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </Search> -->
      <div class="listSelect-gather" style="line-height: 45px">
        采集总数 <span>{{ total }} 条</span>
      </div>
    </div>
    <PullRefresh ref="container" v-model="refreshing" @refresh="onRefresh">
      <List
        v-model="loading"
        @scroll="scroll"
        finished-text="没有更多了"
        :finished="finished"
        @load="onLoad"
      >
        <Cell
          class="listCell"
          @click="handleClick(item)"
          v-for="item in listData"
          :key="item.id"
          :title="item.name"
        >
          <template #title>
            <div class="listCell-title">
              <span v-text="getListText(item, 1)"></span>
              <span v-text="getListText(item, 2)" class="listCell-title-tag"></span>
            </div>
          </template>

          <template #label>
            <div class="listCell-label">
              <span v-text="getListText(item, 3)"></span>
            </div>
          </template>

          <template v-if="item.checked" #right-icon>
            <Icon name="success" />
          </template>
        </Cell>
      </List>
    </PullRefresh>
  </Popup>
</template>

<script>
import { ref, reactive, unref, computed, onMounted, watchEffect, watch } from 'vue';
import { Popup, List, Cell, PullRefresh, Icon } from 'vant';
import { get, omit } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';
import { isString, isArray, isFunction } from '@/utils/is';
import { componentMap } from './componentMap';
// import { useListValues } from "./hooks/useListValues"
// 示例
//  const [register, { handlePopup, setProps, onReset }] = useList({
//       api: getDepartByUser,
//       columns:[
//         {
//           dataIndex:'username',
//         },
//          {
//           dataIndex:'sex_dictText',
//         },
//          {
//           dataIndex:'orgCodeTxt',
//         }
//       ],
//       multi:true
//     });
let comps = {};
for (let key of componentMap.keys()) {
  // + 1 防止组件变量名冲突
  comps[key + 1] = componentMap.get(key);
}
export default {
  name: 'ListSelect',
  components: {
    ...comps,
    PullRefresh,
    Popup,
    List,
    Cell,
    Icon,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    // 请求参数
    params: {
      type: Object,
      default: () => ({}),
    },
    // 请求
    api: {
      type: Function,
      default: null,
    },
    // 请求返回值结果字段
    resultField: {
      type: String,
      default: 'records',
    },
    // 列表字段配置

    columns: {
      type: Array,
      default: () => [],
    },
    // dict 数据
    dictOptions: {
      type: Object,
      default: () => ({}),
    },
    // 查询配置
    queryColumns: {
      type: Object,
      default: () => [],
    },
    // 是否为多选
    multi: {
      type: Boolean,
      default: false,
    },
    chekcField: {
      type: String,
      default: 'id',
    },
  },
  emits: ['register', 'row-click'],
  setup(props, { emit }) {
    const show = ref(false);
    const finished = ref(false); // true 数据加载完成
    const refreshing = ref(false); // 下拉刷新 是否处于加载中
    const loading = ref(false); // 列表 是否处于加载中
    const isFlexd = ref(false);
    const listData = ref([]);
    const innerPropsRef = ref();
    const total = ref(0);
    const checkRef = reactive({});
    const formModel = reactive({
      pageNo: 0,
      pageSize: 10,
    });

    // 设置props
    function setProps(props) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const getBindValue = computed(() => {
      return {
        ...props,
        ...unref(innerPropsRef),
      };
    });

    // 滚动条与底部距离小于 offset 时触发
    const onLoad = useDebounceFn(() => {
      if (getBindValue.value.immediate) {
      }
      if (refreshing.value) {
        listData.value = [];
        formModel.pageNo = 0;
        refreshing.value = false;
      }
      formModel.pageNo++;
      let data = {};
      for (let item in unref(formModel)) {
        if (unref(formModel)[item]) {
          data[item] = unref(formModel)[item];
        }
      }
      // 获取数据
      fetch(data);
    }, 80);

    // 重新赋值选中状态 和 初始选中
    watch(
      () => getBindValue.value.modelValue,
      (val) => {
        if (val) {
          let checkData = val.split(',');
          let checkField = []
          listData.value.forEach((item) => {
            item.checked = checkData.includes(item[getBindValue.value.chekcField]);
            if(item.checked){
                checkField.push(item.realname)
            }
          });
          emit('change',checkField.join())
        }
      },
    );

    async function fetch(data) {
      const api = getBindValue.value.api;
      if (!api || !isFunction(api)) return;
      try {
        loading.value = true;
        const res = await api({ ...data, ...getBindValue.value.params });
        if (Array.isArray(res)) {
          listData.value = [...listData.value, ...res];
          total.value = res.length;
          return;
        }
        if (getBindValue.value.resultField) {
          listData.value = [...listData.value, ...(get(res, getBindValue.value.resultField) || [])];
          total.value = res.total || listData.value.length;
        }
      } catch (error) {
        console.warn(error);
      } finally {
        // 加载完毕
        if (listData.value.length >= total.value) {
          finished.value = true;
        }
        loading.value = false;
      }
    }

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    // 重新加载列表数据
    const onReset = (params) => {
      finished.value = false; // 清空列表数据
      loading.value = true; // 处于加载状态
      // 初始状态
      listData.value = [];
      formModel.pageNo = 0;
      onLoad();
    };

    const scroll = (e) => {
      setTimeout(() => {
        isFlexd.value = true;
      }, 200);
    };

    const handleClick = (items) => {
      if (!getBindValue.value.multi) {
        for (let key in checkRef) {
          checkRef[key].checked = false;
        }
      }

      if (checkRef[items.id]) {
        items.checked = !items.checked;
      } else {
        items.checked = true;
        checkRef[items.id] = items;
      }

      if (!getBindValue.value.multi) {
        show.value = false;
        finished.value = false;
        loading.value = true;
      }
      let checkArr = Object.values(checkRef).filter((item) => item.checked);
      let checkStr = checkArr.map((item) => item[getBindValue.value.chekcField]);
      emit('row-click', items, { checkArr, checkStr: checkStr.join() });
    };

    const handleClose = () => {
      isFlexd.value = false;
    };

    // 打开 或者 关闭
    const handlePopup = (val = true) => {
      show.value = val;
    };

    /**
     * 获取列表 dict value 值
     */
    const getDictValue = (customRender, text) => {
      let dict = getBindValue.value.dictOptions[customRender] || [];
      return dict.find((item) => item.value == text)?.title;
    };

    // 获取列表字段value
    const getListText = (item, type) => {
      let fun = getBindValue.value.getTextFront;
      if (fun && isFunction(fun)) {
        const res = fun(item, type);
        if (res) return res;
      }
      let columns = getBindValue.value.columns[type - 1];
      let text = columns && item[columns.dataIndex];
      columns?.customRender && (text = getDictValue(columns.customRender, text));

      switch (type) {
        case 3:
          let label = columns?.title;
          return `${label ? label + '：' : ''}${text || ''}`;
        default:
          return text;
      }
    };

    const handleChange = useDebounceFn((val) => {
      onReset();
    }, 300);

    const actionType = {
      handlePopup,
      setProps,
      onReset,
    };

    onMounted(() => {
      emit('register', actionType);
    });

    return {
      show,
      total,
      onLoad,
      formModel,
      isFlexd,
      scroll,
      loading,
      refreshing,
      onRefresh,
      handleClose,
      getListText,
      handleChange,
      handleClick,
      finished,
      listData,
      getBindValue,
    };
  },
};
</script>

<style  scoped lang="less" >
@header: 90px;
.listSelectPerch {
  height: @header;
}
.listSelect {
  width: 100%;
  height: @header;
  border-radius: var(--van-popup-round-border-radius) var(--van-popup-round-border-radius) 0 0;
  overflow: hidden;
  &-search {
    display: flex;
    height: 45px;
    background: #fff;
    align-items: center;
    > div {
      width: 50%;
      flex: 1;
    }
  }
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
.listCell {
  &-title {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    // width: calc(100vw - 32px);
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    &-tag {
      font-size: 12px;
      border-radius: 2px;
      padding: 2px 8px;
      font-weight: 400;
      margin-left: 11px;
      color: rgba(255, 164, 0, 1);
      background: rgba(255, 164, 0, 0.09);
    }
  }
  &-label {
    color: #666;
    font-size: 12px;
    width: calc(100vw - 32px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.isFlexd {
  position: fixed;
  bottom: calc(70% - @header);
  z-index: 1;
}
</style>