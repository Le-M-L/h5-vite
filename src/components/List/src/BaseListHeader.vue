<template>
  <div class="base-list-header">
    <div class="base-list-header-content">
      <div
        v-for="item in columns"
        :style="item.sign == 'center' ? 'flex:1;justify-content: center;' : ''"
        :key="item.field"
        class="base-list-header-content-item"
      >
        <component
          :is="item.component + 1"
          @change="handleChange"
          v-bind="item"
          v-model="form[item.field]"
        >
          <template #text="{ data }">
            <div class="base-list-header-content-item-data">
              {{ data }}
              <Icon name="play" />
            </div>
          </template>
        </component>
      </div>
    </div>
    <div class="base-list-header-line"></div>
  </div>
  <div class="base-list-header-placeholder"></div>
</template>

<script>
import { reactive, ref, unref, onMounted, computed, watch } from 'vue';
import { NavBar, Icon } from 'vant';
import { componentMap } from './componentMap';
import { formatSchemas } from './hooks/handle';
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
    id: {
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
  },
  emits: ['change'],
  setup(props, { emit }) {
    const form = reactive({
      time: [],
      school: '',
    });
    // 查询配置
    const columns = ref([]);
    const handleChange = (e) => {
        console.log(form)
    };

    watch(
      () => props.queryColumns,
      (values) => {
        columns.value = formatSchemas(unref(values), props.dictOptions).slice(0, 2);
        console.log(columns.value);
      },
    );

    onMounted(() => {
      console.log(props);
    });

    return {
      form,
      handleChange,
      columns,
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
        flex: 2;
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