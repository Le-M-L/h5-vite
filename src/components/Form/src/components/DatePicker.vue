<template>
  <span @click="!getAttrs.readonly ? (show = true) : null">
    <slot name="text" :data="state">
      <Field
        v-bind="getAttrs"
        v-model="state"
        readonly
        :class="{ isDisabled: state }"
        @clear="handleClear"
      />
    </slot>
  </span>
  <Popup v-model:show="show" round position="bottom">
    <DatetimePicker
      v-bind="getBindValue"
      v-model="valueRef"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </Popup>
</template>

<script>
import { ref, computed, unref, watch, watchEffect } from 'vue';
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
      type: [Array, String],
    },
    // 日期格式
    // format: {
    //   type: String,
    //   default: 'YYYY-MM-DD',
    // },
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
    const valueRef = ref();
    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });
    const format = computed(() => {
      let format = 'YYYY-MM-DD'
      if(!attrs.type || attrs.type == 'date'){
        format = 'YYYY-MM-DD'
      }else if(attrs.type == 'datetime'){
        format = 'YYYY-MM-DD HH:mm'
      }

      return attrs.format || format
    })
    const getBindValue = computed(() => {
      let bindValue = {
        type: attrs.type ? attrs.type: 'date',
        ...omit(attrs, ['inputProps','format']),
        ...omit(props, 'modelValue'),
        format: unref(format)
      };
      return bindValue;
    });

    watchEffect(() => {
      if (getBindValue.value.type == 'time') {
        let myDate = new Date();
        valueRef.value = unref(state)
          ? unref(state)
          : `${myDate.getHours()}:${myDate.getMinutes()}`;
      } else {
        valueRef.value = unref(state) ? new Date(unref(state)) : new Date();
      }
    });

    // const valueRef = computed(() => {
    //   if (getBindValue.value.type == 'time') {
    //     let myDate = new Date();
    //     return unref(state) ? unref(state) : `${myDate.getHours()}:${myDate.getMinutes()}`;
    //   }
    //   return unref(state) ? new Date(unref(state)) : new Date();
    // });

    const handleConfirm = (date) => {
      show.value = false;
      if (getBindValue.value.type == 'time') {
        emit('change', date);
      } else if (getBindValue.value.type == 'datetime') {
        emit('change', dateUtil(date).format(props.format || 'YYYY-MM-DD HH:mm'));
      } else {
        emit('change', dateUtil(date).format(props.format));
      }
    };

    const handleCancel = () => {
      show.value = false;
    };

    const handleClear = () => {};

    return {
      show,
      state,
      valueRef,
      getBindValue,
      handleConfirm,
      handleCancel,
      getAttrs,
      handleClear,
    };
  },
};
</script>

<style>
</style>