<template>
  <Field
    v-bind="getAttrs"
    disabled
    :class="{ isDisabled: fieldValue }"
    @clear="handleClear"
    v-model="fieldValue"
    @click="handlePopup"
  />
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
        <template v-for="item in getSchema.slice(0, 2)" :key="item.id">
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
import { computed, onMounted, reactive, ref, unref } from 'vue';
import {
  List,
  Cell,
  Popup,
  Field,
  Search,
  PullRefresh,
  Sticky,
  Icon,
  DropdownMenu,
  DropdownItem,
} from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { getPopupColumns, getPopupListData, getPopupQuery } from '@/api/sys/api';
import { useDebounceFn } from '@vueuse/core';
import { componentMap } from './componentMap';
import { formatSchemas } from './hooks/handle';
import { useListSelect } from './hooks/useListSelect';
let comps = {};
for (let key of componentMap.keys()) {
  // + 1 防止组件变量名冲突
  comps[key + 1] = componentMap.get(key);
}
export default {
  name: 'ListSelect',
  inheritAttrs: false,
  components: {
    ...comps,
    List,
    Popup,
    Field,
    Cell,
    PullRefresh,
    Sticky,
    Search,
    Icon,
    DropdownMenu,
    DropdownItem,
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
    const listData = ref([]);
    const total = ref(0);
    const value = ref('');
    const formModel = reactive({
      pageNo: 0,
      pageSize: 10,
    });
    const listColumns = ref([]); //列表字段 配置
    const queryColumns = ref([]); // 查询条件 配置
    const cgRpConfigIdRef = ref('');
    const listDict = ref({});
    const options = ref([]);
    const checkRef = ref({});
    const { getCheckParams } = useListSelect({ checkRef, formValues: attrs.formValues, emit });

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

    // 重新加载列表数据
    const onReset = (params) => {
      finished.value = false; // 清空列表数据
      loading.value = true; // 处于加载状态
      // 初始状态
      listData.value = [];
      formModel.pageNo = 0;
      onLoad();
    };

    // 滚动条与底部距离小于 offset 时触发
    const onLoad = useDebounceFn(() => {
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
      getPopupListData(unref(cgRpConfigIdRef), data)
        .then(({ total: totals, records }) => {
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
      // 用于多选 现在先不做 后期在做
      // const { popupMulti } = attrs.formValues.schema;
      // checkRef.value[items.id] = items;
      Object.values(unref(checkRef)).forEach(item => {
        item.checked = false;
      })
      items.checked = true;
      checkRef.value[items.id] = items;
      const { fieldName } = getCheckParams();
      fieldValue.value = fieldName;
      show.value = false;
      finished.value = false;
      loading.value = true;
    };


        // 清空数据
    const handleClear = () => {
      Object.values(unref(checkRef)).forEach(item => {
        item.checked = false;
      })
      checkRef.value = {};
      const { fieldName } = getCheckParams();
      fieldValue.value = fieldName;
    };


    // 弹窗显示
    const handlePopup = async () => {
      const { code } = unref(getAttrs);
      // columns 列表展示配置
      // dictOptions 列表展示 下拉数据
      let { cgRpConfigId, columns = [], dictOptions } = await getPopupColumns(code);
      cgRpConfigIdRef.value = cgRpConfigId;
      listColumns.value = columns.slice(0, 3);
      listDict.value = dictOptions;
      // 获取查询条件配置
      getPopupQuery(cgRpConfigId).then((res = []) => {
        queryColumns.value = res;
      });

      show.value = true;
    };

    const getSchema = computed(() => {
      return formatSchemas(queryColumns.value, listDict.value);
    });

    /**
     * 获取列表 dict value 值
     */
    const getDictValue = (customRender, text) => {
      let dict = listDict.value[customRender] || [];
      return dict.find((item) => item.value == text)?.title;
    };

    // 获取列表字段value
    const getListText = (item, type) => {
      let columns = listColumns.value[type - 1];
      let text = columns && item[columns.dataIndex];
      columns.customRender && (text = getDictValue(columns.customRender, text));

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


    return {
      state,
      show,
      fieldValue,
      getAttrs,
      getBindValue,
      finished,
      listData,
      total,
      listColumns,
      queryColumns,
      getListText,
      options,
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
      formModel,
      getSchema,
      handleChange,
      handleClear,
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