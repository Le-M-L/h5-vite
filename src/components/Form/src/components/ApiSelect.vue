<template>
  <slot name="text" :data="getText">
    <Field is-link readonly v-bind="getAttrs" v-model="getText" @click="show = true" />
  </slot>
  <Popup v-model:show="show" round position="bottom">
    <Picker
      ref="picker"
      :columns="getOptions"
      :loading="loading"
      :defaultIndex="defaultIndex"
      @confirm="handleConfirm"
      @change="handleChange"
      @cancel="handleCancel"
      v-bind="getBindValue"
    />
  </Popup>
</template>

<script>
import { computed, ref, unref, watch, watchEffect, onMounted } from 'vue';
import { Picker, Popup, Field } from 'vant';
import { isFunction } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
export default {
  name: 'ApiSelect',
  inheritAttrs: false,
  components: {
    Picker,
    Field,
    Popup,
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
  emits: ['change', 'register'],
  setup(props, { emit, attrs }) {
    const picker = ref(null);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const options = ref([]);
    const show = ref(false);
    const defaultIndex = ref();
    const innerPropsRef = ref();
    // 嵌入表单中，只需使用钩子绑定来执行表单验证
    const [state] = useRuleFormItem(props);
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;
      let defaultValue = unref(state);
      return unref(options).reduce((prev, next, index) => {
        if (next) {
          const value = next[valueField];
          /// 设置默认选中
          if (value == defaultValue) {
            defaultIndex.value = index;
          }
          prev.push({
            text: next[labelField],
            value: numberToString ? `${value}` : value,
            ...omit(next, [labelField, valueField]),
          });
        }
        return prev;
      }, []);
    });

    const getText = computed(() => {
      let value = unref(state);
      return unref(getOptions).find((item) => item.value == value)?.text ?? value;
    });

    watchEffect(async () => {
      props.immediate && (await fetch());
    });

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch();
      },
      { deep: true },
    );

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

    function handleChange(...args) {
      // emit('change', ...args);
    }

    const handleConfirm = (...args) => {
      show.value = false;
      unref(innerPropsRef)?.callback?.(...args)
      emit('change', ...args);
    };

    const handleCancel = () => {
      show.value = false;
    };

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...omit(unref(innerPropsRef),['options','callback']) 
      };
    });
    console.log(getBindValue)

    function setProps(props) {
      if(props.options){
        options.value = props.options;
      }
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const handleShow = () => {
      show.value = true;
    }

    const actionType = {
      handleShow,
      setProps,
    };

    onMounted(() => {
      emit('register', actionType);
    });
    return {
      getOptions,
      options,
      loading,
      picker,
      getText,
      show,
      defaultIndex,
      handleConfirm,
      handleChange,
      handleCancel,
      getAttrs,
      getBindValue,
    };
  },
};
</script>

<style>
</style>