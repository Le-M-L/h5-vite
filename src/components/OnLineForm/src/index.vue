<template>
  <NavBar
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    fixed
    placeholder
  >
    <template #title
      ><span class="nav-bar-title">{{ title }}</span>
    </template>
    <template #right>
      <Icon name="search" color="#666666" @click="handleSearch" size="20" />
    </template>
  </NavBar>
  <div style="height:12px" ></div>
  <BasicForm :schemas="getSchemas" @submit="submit"> </BasicForm>
</template>

<script>
import { computed, unref,ref } from 'vue';
import { BasicForm } from '@/components/Form';
import { useRoute } from "vue-router"
import { useOnlineStoreWithOut } from "@/store/modules/online"
import { NavBar, Icon } from 'vant';
export default {
  inheritAttrs:false,
  components: { BasicForm, NavBar, Icon },
  props: {
    schemas: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute();
    const { code } = route.params;
    const title = ref('添加');
    const onlineStore = useOnlineStoreWithOut();
    // 表单数据格式化
    const getSchemas = computed(() => unref(onlineStore.getOnlineFormSchema));
    // 提交
    const submit = () => {};
    // 获取表单项
    onlineStore.setOnlineFormSchema(code)
    // 点击左边返回触发
    const onClickLeft = () => history.back();
    const onClickRight = () => {};
    const handleSearch = () => {}
    return {
      getSchemas,
      submit,
      title,
      onClickLeft,
      onClickRight,
      handleSearch

    };
  },
};
</script>

<style>
</style> 