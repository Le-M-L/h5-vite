<template>
  <Field v-bind="getAttrs" readonly>
    <template #input>
      <RadioGroup
        v-bind="getBindValue"
        v-model="state"
        @change="handleChange"
        direction="horizontal"
      >
        <template v-for="item in getOptions" :key="`${item.value}`">
          <Radio :name="item.value" :disabled="item.disabled">
            {{ item.label }}
          </Radio>
        </template>
      </RadioGroup>
    </template>
  </Field>
</template>

<script>
import { computed, ref, watchEffect, watch, unref } from 'vue';
import { RadioGroup, Radio, Field } from 'vant';
import { isFunction } from '@/utils/is';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'ApiRadioGroup',
  components: {
    RadioGroup,
    Radio,
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
      type: [String, Number, Boolean],
    },
    isBtn: {
      type: [Boolean],
      default: false,
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
    const emitData = ref([]);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const [state] = useRuleFormItem(props);

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        disabled: getAttrs.value.readonly,
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
    return { state, getAttrs, getOptions, getBindValue, loading, handleChange, props };
  },
};
</script>

<style>
</style>