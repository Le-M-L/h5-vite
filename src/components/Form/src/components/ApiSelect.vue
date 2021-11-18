<template>
  <Field is-link readonly v-bind="attrs" v-model="getText" @click="showPicker = true" />
  <Popup v-model:show="showPicker" round position="bottom">
    <Picker
      ref="picker"
      :columns="getOptions"
      :loading="loading"
      @confirm="handleConfirm"
      @change="handleChange"
      @cancel="handleCancel"
    />
  </Popup>
</template>

<script>
import { computed, ref, unref, watch, watchEffect } from 'vue';
import { Picker, Popup, Field } from 'vant';
import { isFunction } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useAttrs } from '@/hooks/core/useAttrs';
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
      default: 'values',
    },
    childrenField: {
      type: String,
      default: 'children',
    },
    immediate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['options-change', 'change', 'cancel'],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const picker = ref(null);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const options = ref([]);
    const emitData = ref([]);
    const showPicker = ref(false);
    // 嵌入表单中，只需使用钩子绑定来执行表单验证  
    const [state] = useRuleFormItem(props, 'modelValue', 'change', emitData);
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;

      return unref(options).reduce((prev, next) => {
        if (next) {
          const value = next[valueField];
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
       let value = unref(state)
       return unref(getOptions).find(item => item.value == value)?.text ?? value;
    })

    watchEffect(() => {
      props.immediate && fetch();
    });

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch();
      },
      { deep: true },
    );

    async function fetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      options.value = [];
      try {
        loading.value = true;
        const res = await api(props.params);
        if (Array.isArray(res)) {
          options.value = res;
          emitChange();
          return;
        }
        // 当返回值是一个对象时 可以设置resultField 取指定值
        if (props.resultField) {
          options.value = get(res, props.resultField) || [];
        }
        emitChange();
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    function handleChange(...args) {
      //  emitData.value = args;
      // emit('change', ...args);
    }

    function emitChange() {
      emit('options-change', unref(getOptions));
    }

    const handleConfirm = (...args) => {
      showPicker.value = false;
      emit('change', ...args);
      // emitData.value = args;
    };
 

    const handleCancel = () => {
      showPicker.value = false;
    };

    return {
      getOptions,
      options,
      loading,
      picker,
      getText,
      attrs,
      showPicker,
      handleConfirm,
      handleChange,
      handleCancel,
    };
  },
};
</script>

<style>
</style>