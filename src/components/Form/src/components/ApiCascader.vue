<template>
  <div>
    <Field is-link readonly placeholder="请选择所在地区" v-model="getText" @click="show = true" />
    <Popup v-model:show="show" round position="bottom">
      <Cascader
        :fieldNames="fieldNames"
        :closeable="closeable"
        v-model="state"
        @finish="handleChange"
        @close="handleClose"
        readonly
      />
    </Popup>
  </div>
</template>

<script>
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
    const emitData = ref([]);
    const attrs = useAttrs();
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const [state] = useRuleFormItem(props);
    const show = ref(false);
    const getOptions = computed(() => {
      return unref(options);
    });

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

    function emitChange() {
      emit('options-change', unref(getOptions));
    }

    // 全部选择完之后 调用
    function handleChange(e) {
      console.log(e);
    }

    // 点击关闭按钮时触发
    function handleClose() {}

    const fieldNames = computed(() => {
      const { labelField, valueField, childField, fieldNames } = props;
      return {
        text: labelField,
        value: valueField,
        children: childField,
        ...fieldNames,
      };
    });

    const getText = ref('');

    return {
      state,
      getOptions,
      fieldNames,
      show,
      attrs,
      getText,
      loading,
      handleChange,
      handleClose,
    };
  },
};
</script>

<style>
</style>