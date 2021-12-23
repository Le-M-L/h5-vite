<template>
  <Field v-bind="getAttrs" v-model="state" readonly @click="show = true" />
  <Popup v-model:show="show" round position="bottom">
    <DatetimePicker v-bind="getBindValue" @confirm="handleConfirm" @cancel="handleCancel" />
  </Popup>
</template>

<script>
import { ref, computed, unref, watch } from 'vue';
import { DatetimePicker, Popup, Field } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { dateUtil } from '@/utils/dateUtil';
import { get, omit } from 'lodash-es';
export default {
  name: 'DatePicker',
  inheritAttrs: false,
  components: {
    DatetimePicker,
    Field,
    Popup,
  },
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
    },
    // 日期格式
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    // 日期选项格式化
    formatter: {
      type: Function,
      default: (type, value) => {
        switch (type) {
          case 'year': // 年
            break;
          case 'month': // 月
            break;
          case 'day': // 时
            break;
          case 'hour': // 分
            break;
          case 'minute': // 秒
            break;
          default:
            break;
        }
        return value;
      },
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const show = ref(false);
    // 嵌入表单中，只需使用钩子绑定来执行表单验证
    const [state] = useRuleFormItem(props);
    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });
    const getBindValue = computed(() => {
      let bindValue = {
        type: 'date',
        ...omit(attrs, 'inputProps'),
        ...props,
        modelValue: unref(state)? new Date(unref(state)):new Date(),
      };
      return bindValue;
    });

    const handleConfirm = (date) => {
      show.value = false;
      emit('change', dateUtil(date).format(props.format));
    };

    const handleCancel = () => {
      show.value = false;
    };

    return {
      show,
      state,
      getBindValue,
      handleConfirm,
      handleCancel,
      getAttrs,
    };
  },
};
</script>

<style>
</style>