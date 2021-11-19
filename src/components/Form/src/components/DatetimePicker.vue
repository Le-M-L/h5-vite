<template>
  <Field is-link readonly v-model="state" @click="show = true" />
  <Popup v-model:show="show" round position="bottom">
    <DatetimePicker v-bind="getBindValue" @confirm="handleConfirm" @cancel="handleCancel" />
  </Popup>
</template>

<script>
import { ref, unref, computed } from 'vue';
import { DatetimePicker, Popup, Field } from 'vant';
import { omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { dateUtil } from '@/utils/dateUtil';
export default {
  name: 'DatetimePicker',
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
    // formatter: {
    //   type: Function,
    //   default: (type, value) => {
    //     switch (type) {
    //       case 'year': // 年
    //         break;
    //       case 'month': // 月
    //         break;
    //       case 'day': // 时
    //         break;
    //       case 'hour': // 分
    //         break;
    //       case 'minute': // 秒
    //         break;
    //       default:
    //         break;
    //     }
    //     return value;
    //   },
    // },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const show = ref(false);
    // 嵌入表单中，只需使用钩子绑定来执行表单验证
    const [state] = useRuleFormItem(props);

    const getBindValue = computed(() => {
      let bindValue = {
        ...omit(attrs, 'modelValue'),
        ...props,
      };
      return omit(bindValue, 'modelValue');
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
    };
  },
};
</script>

<style>
</style>