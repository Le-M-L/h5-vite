<template>
  <span @click="handlePopup ">
    <slot name="text" :data="getText">
      <Field v-bind="getAttrs" disabled is-link :class="{ isDisabled: getText }" @clear="handleClear" v-model="getText" />
    </slot>
  </span>

  <List @register="register" v-model="state" :list="options"  @row-click="handleClick">
    <template #action>
      <div class="action">
        <button class="van-picker__cancel" @click="handleClose" >关闭</button>
        <button class="van-picker__confirm" @click="handleSubmit">确定</button>
      </div>
    </template>
    <template #title="{ item = {} }">
      <Checkbox v-model="item.checked">
        {{ item.title }}
      </Checkbox>
    </template>
  </List>
</template>

<script>
import { computed, ref, unref, watchEffect } from 'vue';
import { Popup, Checkbox, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { List, useList } from './List';
// import { getPopupColumns, getPopupListData, getPopupQuery } from '@/api/sys/api';
// import { formatSchemas } from './hooks/handle';

export default {
  name: 'ApiSelectMulti',
  inheritAttrs: false,
  components: {
    Popup,
    Field,
    List,
    Checkbox,
  },
  props: {
    api: {
      type: Function,
      default: null,
    },
    modelValue: {
      type: [Array, Object, String, Number],
    },
    numberToString: {
      type: Boolean,
    },
    resultField: {
      type: String,
      default: 'result',
    },
    labelField: {
      type: String,
      default: 'text',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    childrenField: {
      type: String,
      default: 'children',
    },
    immediate: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const [state] = useRuleFormItem(props);
    const options = ref([]);
    const loading = ref(false);
    const ids = ref('')

    const [register, { handlePopup, handleClose, setProps }] = useList({
      showTotal: false,
      multi: true,
      isFlexd: false,
      isChecked:false,
      chekcField:props.valueField
    });

    watchEffect(async () => {
      props.immediate && (await fetch());
    });

    async function fetch() {
      if (props.options && props.options.length) {
        options.value = props.options;
        return;
      }
      const api = props.api;
      if (!api || !isFunction(api)) return;
      options.value = [];
      try {
        loading.value = true;
        const res = await api(props.params);
        if (Array.isArray(res)) {
          options.value = res;
          return;
        }
        // 当返回值是一个对象时 可以设置resultField 取指定值
        if (props.resultField) {
          options.value = get(res, props.resultField) || [];
        }
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

     // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const getText = computed(() => {
        let arr = unref(state)?.split(',') ||[];
        let checkArr = unref(options).filter(item => arr.includes(item[props.valueField]))
        return checkArr.map(item => item[props.labelField] ).join()
    })

    const handleClick = (item, { checkArr, checkIds }) => {
      ids.value = checkIds
    };

    const handleSubmit = () => {
        emit('change',ids.value);
        handleClose()
    }

    // 清空数据
    const handleClear = () => {};

    return {
      state,
      options,
      handlePopup,
      handleSubmit,
      handleClose,
      handleClear,
      register,
      handleClick,
      getText,
      getAttrs
    };
  },
};
</script>

<style lang="less">
.action {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
