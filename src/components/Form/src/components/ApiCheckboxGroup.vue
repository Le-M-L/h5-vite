<template>
  <CheckboxGroup v-model="state" @change="handleChange" v-bind="attrs" >
    <template v-for="item in getOptions" :key="`${item.value}`">
      <Checkbox :name="item.value" :disabled="item.disabled">
        {{ item.label }}
        <!-- 自定义图标 -->
        <!-- <template #icon="props">
         
        </template> -->
      </Checkbox>
    </template>
  </CheckboxGroup>
</template>

<script>
import { computed, ref, watchEffect, watch, unref } from 'vue';
import { Checkbox, CheckboxGroup } from 'vant';
import { isFunction } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useAttrs } from '@/hooks/core/useAttrs';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'ApiCheckboxGroup',
  components: {
    CheckboxGroup,
    Checkbox,
  },
  props: {
    api: {
      type: Function,
      default: null,
    },
    params: {
      type: [Object, String],
      default: () => ({}),
    },
    modelValue: {
      type: Array,
      default: () => [],
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
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    immediate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const options = ref([]);
    const emitData = ref([]);
    const attrs = useAttrs();
    const loading = ref(false);
     const isFirstLoad = ref(true);
    const [state] = useRuleFormItem(props);
    
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;

      return unref(options).reduce((prev, next) => {
        if (next) {
          const value = next[valueField];
          prev.push({
            label: next[labelField],
            value: numberToString ? `${value}` : value,
            ...omit(next, [labelField, valueField]),
          });
        }
        return prev;
      }, []);
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

    function handleChange(_, ...args) {
      console.log(_, args);
      emitData.value = args;
    }
    return { state, getOptions, attrs, loading, handleChange };
  },
};
</script>

<style>
</style>