<template>
  <Form @submit="onSubmit">
    <CellGroup v-bind="getRow" >
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />

      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </CellGroup>
    <van-button round block type="primary" native-type="submit"> 提交 </van-button>
  </Form>
</template>

<script>
import { ref, unref, computed } from 'vue';
import { CellGroup, Cell, Field, Form } from 'vant';
export default {
  components: {
    Form,
    CellGroup,
    Cell,
    [Field.name]: Field,
  },
  setup(props) {
    const username = ref('');
    const password = ref('');
    const onSubmit = (values) => {
      console.log('submit', values);
    };

    const propsRef = ref({});

    // 获取表单的基本配置
    const getProps = computed(() => {
      return { ...props, ...unref(propsRef) };
    });

    // 为整个表单获取统一的行样式和行配置
    const getRow = computed(() => {
      const { baseRowStyle = {}, rowProps } = unref(getProps);
      return {
        style: baseRowStyle,
        ...rowProps,
      };
    });

    return {
      onSubmit,
      username,
      password,
      getRow,
    };
  },
};
</script>

<style>
</style>