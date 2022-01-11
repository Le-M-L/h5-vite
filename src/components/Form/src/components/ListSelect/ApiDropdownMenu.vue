<template>
  <DropdownMenu v-bind="getAttrs" readonly>
    <DropdownItem v-model="state" :options="getOptions" />
  </DropdownMenu>
</template>

<script>
import { computed } from 'vue';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { DropdownMenu, DropdownItem } from 'vant';
export default {
  name: 'ApiDropdownMenu',
  components: {
    DropdownMenu,
    DropdownItem,
  },
  props: {
    api: {
      type: Function,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
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
    immediate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change'],
  setup(props, { attrs }) {
    const [state] = useRuleFormItem(props);
    const options = ref([]);
    const loading = ref(false)

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const getBindValue = computed(() => {
      return omit(attrs, 'inputProps');
    });

    const getOptions = computed(() => {
      const {} = props;
      return unref(options).reduce((prev, next, index) => {
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

    return { state, getAttrs, getBindValue, getOptions };
  },
};
</script>

<style>
</style>