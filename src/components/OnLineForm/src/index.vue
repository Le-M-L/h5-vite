<template>
  <DNavbar />
  <div style="height: 12px"></div>
  <Button @click="getFormData">获取</Button>
  <Button @click="setFormData">设置</Button>
  <Button @click="resetFormData">重置</Button>
  <Button @click="subFormData">提交</Button>
  <Button @click="validate1">检验</Button>
  <Button @click="updateForm">更新</Button>
  <Button @click="append">插入某个字段之后</Button>
  <Button @click="remove">根据字段名删除</Button>
  <Button @click="clearValidate1">重置表单校验</Button>
  <Button @click="goRecord">记录</Button>

  <BasicForm @register="register" @submit="onSubmit" :schemas="getSchemas"> </BasicForm>
</template>

<script>
import { computed, unref, ref, onMounted } from 'vue';
import DNavbar from '@/components/DNavbar.vue';
import { BasicForm, useForm } from '@/components/Form';
import { useRoute } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { Button } from 'vant';
import { router } from '../../../router';
export default {
  name: 'OnLineForm',
  inheritAttrs: false,
  components: { BasicForm, Button, DNavbar },
  props: {
    schemas: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute();
    const { code, id } = route.params;
    const onlineStore = useOnlineStoreWithOut();
    const [
      register,
      {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        submit,
        validate,
        updateSchema,
        appendSchemaByField,
        removeSchemaByFiled,
        clearValidate,
      },
    ] = useForm({});

    const getFormData = () => {
      let dd = getFieldsValue();
      console.log(dd);
    };

    const setFormData = () => {};

    const resetFormData = () => {
      resetFields();
    };

    const subFormData = async () => {
      let dd = await submit();
      console.log(dd);
    };

    const onSubmit = (val) => {
      console.log(val);
    };

    const validate1 = async () => {
      await validate();
    };

    const updateForm = () => {
      updateSchema({
        field: 'id_card',
        label: '666',
      });
    };

    const append = () => {
      appendSchemaByField({
        field: 'id_card11',
        component: 'Input',
        label: '666',
        show: true,
        itemProps: {},
      });
    };

    const remove = () => {
      removeSchemaByFiled('id_card11');
    };

    const clearValidate1 = () => {
      clearValidate();
    };

    // 在线表单子集
    const goRecord = () => {
      router.push(`/online/cgformErpSubList/${id}`);
    };

    const title = ref('添加');
    // 表单数据格式化
    const getSchemas = computed(() => onlineStore.getOnlineFormSchema);
    // 获取表单项 和 详情数据
    onlineStore.setOnlineFormSchema(code, id).then((res) => {
      console.log(res);
      res && setFieldsValue(res);
    });
    onMounted(() => {
      console.log('123');
    });
    return {
      getSchemas,
      submit,
      title,
      register,
      getFormData,
      setFormData,
      resetFormData,
      subFormData,
      validate1,
      onSubmit,
      updateForm,
      append,
      remove,
      clearValidate1,
      goRecord,
    };
  },
};
</script>

<style>
</style> 