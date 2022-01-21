<template>
  <Field v-bind="getAttrs" is-link v-model="getText" @click="show = true" readonly />
  <Popup
    class="select-depart"
    v-model:show="show"
    :style="{ height: '70%' }"
    safe-area-inset-bottom
    position="bottom"
    @opened="scroll"
  >
    <div v-if="isFlexd" class="selectPerch"></div>
      <div class="departCheck" style="color: rgb(41, 121, 255);" >
        <span>选择部门</span>
        <div></div>

      </div>
    <div class="select-depart-title" :class="{ isFlexd: isFlexd }">
      <span @click="handelClick('close')">关闭</span>
      <span style="color: rgb(41, 121, 255);" @click="handleShow">确定</span>
    </div>
    <LyTree
      :ready="ready"
      node-key="id"
      :treeData="treeData"
      @node-expand="handleNodeExpand"
      :props="fieldNames"
      :highlightCurrent="true"
      @node-click="handleNodeClick"
      ref="LyTree"
    />
    <div class="flxedClass">
      <span>已选部门：{{ label }}</span>
      <span style="color: rgb(41, 121, 255);" >选择用户</span>
    </div>
    <List @register="register" v-model="state" v-model:field="checkField" @row-click="rowClick" @change="handleChange" />
  </Popup>
</template>

<script>
import { computed, ref, unref, watch, watchEffect, onMounted, nextTick } from 'vue';
import LyTree from '@/components/ly-tree/ly-tree.vue';
import { Field, Popup } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { queryDepartTreeList } from '@/api/sys/api';
import { get, omit } from 'lodash-es';
import ListSelect from '../ListSelect/index.vue';
import { List, useList } from '../List';
import { getDepartByUser, getMultiUser } from '@/api/sys/api';
// 分类字典表
export default {
  name: 'ClassifyTree',
  inheritAttrs: false,
  components: { LyTree, Field, Popup, ListSelect, List },
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
          label: 'departName',
          children: 'children',
          isLeaf: 'leaf',
        };
      },
    },
  },
  setup(props, { attrs, emit }) {
    const show = ref(false);
    const ready = ref(false); // 用于控制加载状态
    const treeData = ref([]);
    const [state] = useRuleFormItem(props);
    const isFlexd = ref(false);
    const label = ref('');
    const checkArr = ref([]);
    const checkField = ref('')

    const [register, { handlePopup, setProps, onReset }] = useList({
      api: getDepartByUser,
      columns: [
        {
          dataIndex: 'username',
        },
        {
          dataIndex: 'sex_dictText',
        },
        {
          dataIndex: 'orgCodeTxt',
        },
      ],
      queryColumns: [
        {
          field: 'username', // 字段
          label: '用户账号', // 字段label
          component: 'InputWidget',
          inputProps: {
            clearable: true,
            'clear-trigger': 'always',
            placeholder: '请输入用账号',
          },
          componentProps: {
            clearable: true,
            'clear-trigger': 'always',
          },
        },
      ],
      multi: true,

    });

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
    const getText = computed(() => {
      console.log( unref(state))
     return  unref(state)
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...omit(unref(innerPropsRef), ['options', 'callback']),
      };
    });

    const handleNodeExpand = (a) => {
      console.log(a);
    };

    const handleNodeClick = ({ key, label: label1 }) => {
      label.value = label1;
      setProps({ params: { departId: key } });
    };

    const handelClick = (a) => {
      console.log(a);
    };

    const handleShow = () => {
      handlePopup();
      onReset();
    };

    // 行数据
    const rowClick = (items, { checkArr, checkStr }) => {
      console.log(checkStr)
      // getMultiUser({id:checkStr})
      // .then(({data}) => {
      //   let ids = []
      //  let realname = data.map(item => {
      //    ids.push(item.id)
      //    return item.realname
      //  });
        emit('change',checkStr);
      // })
    };

    const handleChange = (val) => {
      
    }

    queryDepartTreeList().then((res) => {
      treeData.value = res;
      ready.value = true;
    });

    const scroll = (e) => {
      setTimeout(() => {
        isFlexd.value = true;
      }, 200);
    };

    return {
      getAttrs,
      getBindValue,
      handleNodeExpand,
      handleNodeClick,
      handelClick,
      getText,
      show,
      ready,
      treeData,
      isFlexd,
      scroll,
      register,
      handleShow,
      rowClick,
      label,
      state,
      checkField,
    };
  },
};
</script>

<style scoped lang="less">
@header: 50px;
.selectPerch {
  height: @header;
}
.select-depart {
  &-title {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    height: 50px;
    background: #fff;
    width: 100%;
  }
}
.isFlexd {
  position: fixed;
  bottom: calc(70% - @header);
  z-index: 1;
}
.flxedClass {
  position: fixed;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  bottom: 0;
  width: 100%;
  background: #fff;
  height: 40px;
  line-height: 40px;
  z-index: 1;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
}
.departCheck{

}
</style>