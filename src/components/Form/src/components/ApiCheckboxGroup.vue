<template>
  <Field v-bind="getAttrs" readonly>
    <template #input>
      <CheckboxGroup v-bind="getBindValue" v-model="check" @change="handleChange">
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
  </Field>
</template>

<script>
import { computed, ref, watchEffect, watch, unref } from 'vue';
import { Checkbox, CheckboxGroup, Field } from 'vant';
import { isFunction, isString } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
export default {
  name: 'ApiCheckboxGroup',
  components: {
    CheckboxGroup,
    Checkbox,
    Field,
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
      type: [Array, String],
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
    options: {
      type: Object,
      default: () => [],
    },
  },
  emits: ['options-change', 'change'],
  setup(props, { emit, attrs }) {
    const options = ref([]);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const [state] = useRuleFormItem(props);
    const check = ref([]);
    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const getBindValue = computed(() => {
      return {
        direction: 'horizontal',
        ...omit(attrs, 'inputProps'),
        disabled:getAttrs.value.readonly,
        // readonly:getAttrs.value.readonly
      };
    });

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

    watchEffect(() => {
      check.value = unref(state) && isString(unref(state)) ? unref(state).split(',') : [];
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

    function handleChange(arr) {
      emit('change', arr.join());
    }
    return { check, getOptions, getAttrs, getBindValue, loading, handleChange };
  },
};
</script>

<style>
</style>