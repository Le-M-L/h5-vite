<template>
  <Field
    v-bind="getAttrs"
    readonly
    placeholder="请选择所属部门"
    v-model="fieldValue"
    @click="show = true"
  />
  <Popup v-model:show="show" round position="bottom">
    <Cascader
      title="请选择所属部门"
      v-model="getValue"
      :field-names="fieldNames"
      :options="options"
      @change="handleChange"
      @finish="handleFinish"
      @close="handleClose"
      v-bind="getBindValue"
    />
  </Popup>
</template>

<script>
import { computed, ref, unref, onMounted, watch, watchEffect } from 'vue';
import { Cascader, Popup, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { basicProps } from './apiCascaderProps';
import { queryDepartTreeList, getDepartInfoById } from '@/api/sys/api';
export default {
  name: 'DepartCascader',
  inheritAttrs: false,
  components: {
    Cascader,
    Popup,
    Field,
  },
  props: basicProps,
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const options = ref([]);
    const [state] = useRuleFormItem(props);
    const show = ref(false);
    const getValue = ref('');
    const fieldValue = ref('');

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
      };
    });

    watch(
      () => unref(state),
      (val) => {
        getValue.value = val;
        getDepartInfoById({ id: val }).then((res) => {
          fieldValue.value = res.departName;
        });
      },
    );

    // 点击右上方确定按钮触发
    const handleChange = ({ value, selectedOptions, tabIndex }) => {};
    // 点击关闭按钮时触发
    function handleClose() {
      show.value = false;
    }

    // 全部选择完之后 调用
    function handleFinish({ value, selectedOptions }) {
      console.log(selectedOptions)
      show.value = false;
      emit('change', value);
    }

    const fieldNames = {
      text: 'title',
      value: 'orgCode',
      children: 'children',
    };

    onMounted(async () => {
      options.value = await queryDepartTreeList();
    });

    return {
      state,
      show,
      fieldValue,
      options,
      handleClose,
      getAttrs,
      getBindValue,
      handleChange,
      handleFinish,
      fieldNames,
      getValue,
    };
  },
};
</script>

<style>
</style>