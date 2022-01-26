<template>
  <div v-if="getSchema.length" class="base-list-header">
    <div class="base-list-header-content">
      <div
        v-for="item in getSchema.slice(0, 2)"
        :style="item.sign == 'center' ? 'flex:1;justify-content: center;' : ''"
        :key="item.field"
        class="base-list-header-content-item"
      >
        <component
          :is="item.component + 1"
          @change="handleChange"
          v-bind="item"
          v-model="formModel[item.field]"
        >
          <template #text="{ data }">
            <div class="base-list-header-content-item-data">
              {{ data || item.placeholder }}
              <Icon name="play" />
            </div>
          </template>
        </component>
      </div>
    </div>
    <div class="base-list-header-line"></div>
  </div>
  <div v-if="getSchema.length" class="base-list-header-placeholder"></div>
  <div v-else style="height: 15px"></div>
</template>

<script>
import { reactive, ref, unref, onMounted, computed, watch } from 'vue';
import { NavBar, Icon } from 'vant';
import { componentMap } from './componentMap';
import { formatSchemas } from './hooks/handle';
import { useTableValues } from './hooks/useTableValues';
let comps = {};
for (let key of componentMap.keys()) {
  // + 1 防止组件冲突
  comps[key + 1] = componentMap.get(key);
}
export default {
  components: {
    ...comps,
    Icon,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    queryColumns: {
      type: Array,
      default: () => [],
    },
    dictOptions: {
      type: Object,
      default: () => ({}),
    },
    // 多个日期参数使用
    // 示例 [field,['start','end','YYYY-MM-DD']]
    fieldMapToTime: {
      type: Array,
      default: () => [['name', ['startTime', 'endTimeKey']]],
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const formModel = reactive({});
    const schemaRef = ref(null);
    const getProps = computed(() => {
      return { ...props };
    });

    // 查询配置
    const getSchema = computed(() => {
      const schemas = unref(schemaRef) || props.queryColumns;
      return formatSchemas(schemas, props.dictOptions);
    });

    const { handleFormValues } = useTableValues({ getProps, getSchema, formModel });

    const handleChange = (e, items) => {
      let formData = handleFormValues(formModel, items);
      emit('change', formData);
    };

    onMounted(() => {
      console.log(props);
    });

    return {
      formModel,
      handleChange,
      getSchema,
    };
  },
};
</script>

<style lang="less" >
@listHeader: 56px;
.base-list-header {
  position: fixed;
  width: 100%;
  top: 46px;
  height: @listHeader;
  z-index: 1111;
  &-content {
    display: flex;
    background: #fff;
    padding: 0 20px;
    &-item {
      height: 44px;
      text-align: left;

      &-data {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        > i {
          transform: rotate(90deg);
          color: #999;
          margin-left: 5px;
        }
      }
      &:nth-child(1) {
        display: flex;
        flex: 1;
      }
      &:nth-child(2) {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  &-line {
    height: 12px;
    background: #f4f7f9;
  }
}
.base-list-header-placeholder {
  height: @listHeader;
}
</style>