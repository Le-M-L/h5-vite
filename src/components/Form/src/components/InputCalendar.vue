<template>
  <span @click="!getAttrs.readonly ? show = true:null">
    <slot name="text" :data="fieldValue">
      <Field
        v-bind="getAttrs"
        is-link
        disabled
        :class="{ isDisabled: fieldValue }"
        @clear="handleClear"
        v-model="fieldValue"
      />
    </slot>
  </span>
  <Calendar v-bind="getBindValue" v-model:show="show" @confirm="onConfirm" />
</template>

<script>
import { computed, ref, unref, watch, onMounted } from 'vue';
import { Calendar, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { dateUtil } from '@/utils/dateUtil';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { isArray } from '@/utils/is';

export default {
  name: 'FormCalendar',
  inheritAttrs: false,
  components: { Calendar, Field },
  props: {
    modelValue: {
      type: [Array, String],
    },
    // 日期格式
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    type: {
      type: String,
      default: 'single',
    },
  },
  emits: ['change', 'register'],
  setup(props, { emit, attrs, expose }) {
    const fieldValue = ref('');
    const show = ref(false);
    const innerPropsRef = ref();
    const [state] = useRuleFormItem(props);
    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    const getBindValue = computed(() => {
      const { modelValue } = props;
      let defaultDate = null;
      if (modelValue) {
        let values = isArray(modelValue) ? modelValue : [modelValue];
        defaultDate = values.length ? values.map((item) => new Date(item)) : null;
      }
      let bindValue = {
        type: props.type,
        ...omit(unref(innerPropsRef), ['callback']),
        ...omit(attrs, ['inputProps', 'modelValue']),
        defaultDate: (props.type == 'single' && defaultDate?.[0]) || defaultDate, // 默认选中的日期
      };
      return bindValue;
    });

    // 字段回显
    watch(
      () => unref(state),
      (values) => {
        if (!values || !values.length) return;
        if (isArray(values)) {
          switch (props.type) {
            case 'multiple': // 多选
              fieldValue.value = values
                .map((item) => dateUtil(item).format(props.format))
                .join(',');
              break;
            case 'range': // 区间选择
              const [start, end] = values;
              fieldValue.value = `${start && dateUtil(start).format(props.format)}${
                (end && ' - ' + dateUtil(end).format(props.format)) || ''
              }`;
              break;
            case 'single':
              fieldValue.value = dateUtil(values[0]).format(props.format);
              break;
            default:
              break;
          }
        } else {
          fieldValue.value = dateUtil(values).format(props.format);
        }
      },
      {
        immediate: true,
      },
    );

    // 提交给form
    const onConfirm = (value) => {
      let values = isArray(value) ? value : [value];
      let dates = values.map((item) => dateUtil(item).format(props.format));
      show.value = false;
      emit('change', dates);
      unref(innerPropsRef)?.callback?.(dates);
    };

    const handleShow = () => {
      show.value = true;
    };

    function setProps(props) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const actionType = {
      handleShow,
      setProps,
    };

    const handleClear = () => {
      emit('change', '');
    }

    onMounted(() => {
      emit('register', actionType);
    });

    return {
      show,
      getAttrs,
      getBindValue,
      fieldValue,
      onConfirm,
      handleClear
    };
  },
};
</script>

<style>
</style>