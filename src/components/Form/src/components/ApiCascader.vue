<template>
  <div>
    <Field
     v-bind="getAttrs"
      is-link
      readonly
      placeholder="请选择所在地区"
      v-model="fieldValue"
      :class="{ isDisabled: fieldValue }"
      @click="!getAttrs.readonly ? show = true:null"
    />
    <Popup v-model:show="show" round position="bottom">
      <Cascader
        :closeable="closeable"
        v-model="state"
        :options="options"
        @change="handleChange"
        @finish="handleFinish"
        @close="handleClose"
        readonly
      />
    </Popup>
  </div>
</template>

<script>
// 户籍地
import { computed, ref, watchEffect, watch, unref } from 'vue';
import { Cascader, Popup, Field } from 'vant';
import { isFunction } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useAttrs } from '@/hooks/core/useAttrs';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { basicProps } from './apiCascaderProps';
export default {
  name: 'ApiCascader',
  inheritAttrs: false,
  components: {
    Cascader,
    Popup,
    Field,
  },
  props: basicProps,
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const options = ref([]);
    const apiData = ref([]);
    const emitData = ref([]);
    const attrs = useAttrs();
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const [state] = useRuleFormItem(props, 'value', 'change', emitData);
    const show = ref(false);
    const fieldValue = ref('');

    watchEffect(() => {
      props.immediate && initialFetch();
    });

    watch(
      () => props.initFetchParams,
      () => {
        !unref(isFirstLoad) && initialFetch();
      },
      { deep: true },
    );

    watch(
      apiData,
      (data) => {
        const opts = generatorOptions(data);
        options.value = opts;
      },
      { deep: true },
    );

    async function initialFetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      apiData.value = [];
      loading.value = true;
      try {
        const res = await api(props.initFetchParams);
        if (Array.isArray(res)) {
          apiData.value = res;
          return;
        }
        if (props.resultField) {
          apiData.value = get(res, props.resultField) || [];
        }
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    function generatorOptions(options) {
      const { labelField, valueField, numberToString, childField, isLeaf } = props;
      return options.reduce((prev, next) => {
        if (next) {
          const value = next[valueField];
          const item = {
            ...omit(next, [labelField, valueField]),
            text: next[labelField],
            value: numberToString ? `${value}` : value,
            isLeaf: isLeaf && typeof isLeaf === 'function' ? isLeaf(next) : false,
          };
          const children = Reflect.get(next, childField);
          if (children) {
            Reflect.set(item, childField, generatorOptions(children));
          }
          prev.push(item);
        }
        return prev;
      }, []);
    }

    // 改变时触发
    async function handleChange({ value, selectedOptions, tabIndex }) {
      if (!props.asyncFetchParamKey) return;
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      const api = props.api;
      if (!api || !isFunction(api)) return;
      try {
        const res = await api({
          [props.asyncFetchParamKey]: Reflect.get(targetOption, 'text'),
        });
        if (Array.isArray(res)) {
          const children = generatorOptions(res);
          targetOption.children = children;
          return;
        }
        if (props.resultField) {
          const children = generatorOptions(get(res, props.resultField) || []);
          targetOption.children = children;
        }
      } catch (e) {
        console.error(e);
      } finally {
        targetOption.loading = false;
      }
    }

    // 全部选择完之后 调用
    function handleFinish({ selectedOptions }) {
      let values = [];
      show.value = false;
      fieldValue.value = selectedOptions
        .map((option) => {
          values.push(option.value);
          return option.text;
        })
        .join('/');
      emit('change', values.join());
    }

        // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });
    console.log(getAttrs.value)

    // 点击关闭按钮时触发
    function handleClose() {}

    return {
      state,
      show,
      fieldValue,
      loading,
      options,
      handleFinish,
      handleClose,
      handleChange,
      getAttrs
    };
  },
};
</script>

<style>

</style>