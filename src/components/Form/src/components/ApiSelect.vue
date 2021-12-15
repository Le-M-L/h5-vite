<template>
  <Field is-link readonly v-model="getText" @click="show = true" />
  <Popup v-model:show="show" round position="bottom">
    <Picker
      ref="picker"
      :columns="getOptions"
      :loading="loading"
      :defaultIndex="defaultIndex"
      @confirm="handleConfirm"
      @change="handleChange"
      @cancel="handleCancel"
      v-bind="attrs"
    />
  </Popup>
</template>

<script>
import { computed, nextTick, ref, unref, watch, watchEffect } from 'vue';
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
    options:{
      type:Array,
      default: () => ([])
    }
  },
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const picker = ref(null);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const options = ref([]);
    const show = ref(false);
    const defaultIndex = ref();
    // 嵌入表单中，只需使用钩子绑定来执行表单验证
    const [state] = useRuleFormItem(props);
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;
      let defaultValue = unref(state);
      return unref(options).reduce((prev, next, index) => {
        if (next) {
          const value = next[valueField];
          /// 设置默认选中
          if(value == defaultValue){
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
      if(props.options && props.options.length){
          options.value = props.options ;
          return
      }
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
      // emit('change', ...args);
    }

    function emitChange() {
      emit('options-change', unref(getOptions));
    }

    const handleConfirm = (...args) => {
      show.value = false;
      emit('change', ...args);
    };

    const handleCancel = () => {
      show.value = false;
    };

    return {
      getOptions,
      options,
      loading,
      picker,
      getText,
      attrs,
      show,
      defaultIndex,
      handleConfirm,
      handleChange,
      handleCancel,
    };
  },
};
</script>

<style>
</style>