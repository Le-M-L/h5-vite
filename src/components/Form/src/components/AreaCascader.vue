<template>
  <div>
    <Field
      v-bind="getAttrs"
      readonly
      placeholder="请选择所在地区"
      v-model="fieldValue"
     :class="{ isDisabled: fieldValue }"
      @click="!getAttrs.readonly ? show = true:null"
    />
    <Popup v-model:show="show" round position="bottom">
      <Area title="请选择所在地区" :value="state" :area-list="options"  @confirm="confirm" />
    </Popup>
  </div>
</template>

<script>
import { computed, ref, unref } from 'vue';
import { Area, Popup, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { basicProps } from './apiCascaderProps';
import data from 'china-area-data';
import AreaFormat from "./Area";
export default {
  name: 'AreaCascader',
  inheritAttrs: false,
  components: {
    Area,
    Popup,
    Field,
  },
  props: basicProps,
  emits: ['options-change', 'change'],
  setup(props, { emit, attrs }) {
    const options = ref([]);
    const [state] = useRuleFormItem(props);
    const show = ref(false);
    const areaData = new AreaFormat(data);
    options.value = areaData.treeData;

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label:null
      };
    });

    const fieldValue = computed(() => {
      return areaData.getText(unref(state))
    })

    // 点击右上方确定按钮触发
    const confirm = (arr) => {
      let value = arr[arr.length - 1].code;
      emit('change',value)
      show.value = false;
    }

    // 点击关闭按钮时触发
    function handleClose() {}

    return {
      state,
      show,
      fieldValue,
      options,
      handleClose,
      getAttrs,
      confirm,
    };
  },
};
</script>

<style>
</style>