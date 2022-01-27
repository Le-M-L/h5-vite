<template>
  <span @click="!getAttrs.readonly ? show = true:null">
    <slot name="text" :data="getText">
      <Field
        v-bind="getAttrs"
        readonly
        is-link
        :class="{ isDisabled: getText }"
        v-model="getText"
        @clear="handleClear"
      />
    </slot>
  </span>
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
import { computed, ref, unref, watch, watchEffect, onMounted, nextTick } from 'vue';
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
    // 接口
    api: {
      type: Function,
      default: null,
    },
    // 自定义下拉数据  优先使用 后使用api
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [Array, Object, String, Number],
    },
    // 数字转字符串
    numberToString: {
      type: Boolean,
    },
    // 接口返回取的值
    resultField: {
      type: String,
      default: 'result',
    },
    // 自定义 label 字段
    labelField: {
      type: String,
      default: 'text',
    },
    // 自定义 value 字段
    valueField: {
      type: String,
      default: 'value',
    },
    // 是否立即执行请求
    immediate: {
      type: Boolean,
      default: true,
    },

  },
  emits: ['change', 'register'],
  setup(props, { emit, attrs }) {
    const picker = ref(null);
    const loading = ref(false);
    // const isFirstLoad = ref(true);
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
      return unref(getOptions).find((item) => item.value == value)?.text || value;
    });

    watchEffect(async () => {
      props.immediate && (await fetch());
    });

    // watch(
    //   () => props.params,
    //   () => {
    //     !unref(isFirstLoad) && fetch();
    //   },
    //   { deep: true },
    // );

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

    const handleConfirm = async (...args) => {
      show.value = false;
      emit('change', ...args);
      await nextTick();
      // 用于查询的回调
      unref(innerPropsRef)?.callback?.(...args);
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

    const handleClear = () => {
      emit('change', '');
    };

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...omit(unref(innerPropsRef), ['options', 'callback']),
      };
    });

    function setProps(props) {
      if (props.options) {
        options.value = props.options;
      }
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const handleShow = () => {
      show.value = true;
    };

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
      handleClear,
    };
  },
};
</script>

<style>
</style>