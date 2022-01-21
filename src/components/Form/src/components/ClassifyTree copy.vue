<template>
  <Field v-bind="getAttrs" is-link v-model="getText" @click="show = true" readonly />
  <Popup class="select-depart" v-model:show="show" :style="{ height: '50%' }" position="bottom">
    <div class="select-depart-title">
      <span @click="handelClick('close')">关闭</span>
      <span style="color: rgb(41, 121, 255)" @click="handelClick('ok')">确定</span>
    </div>
    <LyTree
      :ready="ready"
      node-key="key"
      @node-expand="handleNodeExpand"
      lazy
      :load="loadNode"
      :props="fieldNames"
      :highlightCurrent="true"
      @node-click="handleNodeClick"
      ref="LyTree"
      v-if="isReady"
    />
  </Popup>
</template>

<script>
import { computed, ref, unref, watch, watchEffect, onMounted, nextTick } from 'vue';
import LyTree from '@/components/ly-tree/ly-tree.vue';
import { Toast, Field, Popup } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { defHttp } from '@/utils/http/axios';
import { get, omit } from 'lodash-es';
import { queryDepartTreeList } from '@/api/sys/api';

// 分类字典表
export default {
  name: 'ClassifyTree',
  inheritAttrs: false,
  components: { LyTree, Field, Popup },
  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },
    pid: {
      type: String,
      default: '',
    },
    pcode: {
      type: String,
      default: '',
    },
    condition: {
      type: String,
      default: '',
    },
    fieldNames: {
      type: Object,
      default: () => {
        return {
          label: 'title',
          children: 'children',
          isLeaf: 'leaf',
        };
      },
    },
  },
  setup(props, { attrs }) {
    const show = ref(false);
    const ready = ref(false); // 用于控制加载状态
    const isReady = ref(false);
    const treeData = ref([]);
    const [state] = useRuleFormItem(props);
    const getText = computed(() => unref(state));

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const handleClear = () => {
      emit('change', '');
    };

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...omit(unref(innerPropsRef), ['options', 'callback']),
      };
    });

    const handleNodeExpand = (a) => {
      console.log(a);
    };

    const handleNodeClick = (a) => {
      console.log(a);
    };

    const handelClick = (a) => {
      console.log(a);
    };

    const loadNode = (node, resolve) => {
      console.log(1324)
      // ready.value = true;
      console.log(ready)
       defHttp
      .get({
        url: '/sys/category/loadTreeData',
        params: {
          pid: props.pid,
          pcode: !props.pcode ? '0' : props.pcode,
          condition: props.condition,
        },
      })
      .then((res) => {
        resolve(res)
        console.log(res)
      });
    }

   onMounted(() => {
     console.log(123)
     isReady.value = true
   })

    return {
      getAttrs,
      getBindValue,
      handleNodeExpand,
      handleNodeClick,
      handelClick,
      getText,
      show,
      ready,
      isReady,
      loadNode
    };
  },
};
</script>

<style scoped lang="less">
.select-depart {
  &-title {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    height: 50px;
    background: #fff;
    z-index: 8888;
  }
}
</style>