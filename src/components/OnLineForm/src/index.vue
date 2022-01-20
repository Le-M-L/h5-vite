<template>
  <DNavbar :title="title" :btn-text="navBtnText" :btn-flag="btnFlag" @click="handleClick" />
  <div style="height: 12px"></div>
  <BasicForm @register="register" :schemas="getFormSchema"> </BasicForm>
  <div class="base-btn-wrap" v-if="btnShow">
    <Button type="primary" block @click="handleSubmit">
      {{ btnText }}
    </Button>
  </div>
  <div class="base-btn-wrap-placeholder"></div>
</template>

<script>
import { computed, unref, ref, onMounted } from 'vue';
import DNavbar from '@/components/DNavbar.vue';
import { BasicForm, useForm } from '@/components/Form';
import { useRoute, useRouter } from 'vue-router';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { Button } from 'vant';
import { useColumns } from './hooks/useColumns';
import { saveOnlineData } from '@/api/sys/api';
import { useMessage } from '@/hooks/web/useMessage';
export default {
  name: 'OnLineForm',
  inheritAttrs: false,
  components: { BasicForm, Button, DNavbar },
  props: {
    schemas: {
      type: Array,
      default: () => [],
    },
    isRecord: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const onlineStore = useOnlineStoreWithOut();
    const { code, id, flag } = route.params;
    const { createMessage } = useMessage();
    const navBtnText = ref('编辑');
    const title = ref('详情');
    const btnFlag = ref('edit');

    const [register, { setFieldsValue, submit, revisability, setReadonly }] = useForm({});
    const { getFormSchema, getFormHead } = useColumns(props, {
      code,
      id,
      setFieldsValue,
    });

    // 按钮文字
    const btnText = computed(() => (id && onlineStore.getOnlineSubList?.length ? '记录' : '提交'));
    // 按钮显示
    const btnShow = computed(
      () => (id && onlineStore.getOnlineSubList?.length && flag == 'true') || !id,
    );

    const handleSubmit = async () => {
      if (!id) {
        let data = await submit();
        save(data).then((res) => {
          createMessage.success('保存成功');
        });
      } else if (onlineStore.getOnlineSubList?.length) {
        // 在线表单子集
        router.push(`/online/cgformErpSubList/${id}`);
      }
    };

    // 点击编辑
    const handleClick = async ({ flag }) => {
      switch (flag) {
        case 'edit':
          title.value = '编辑';
          navBtnText.value = '保存';
          btnFlag.value = 'save';
          revisability();
          break;
        case 'save':
          let data = await submit();
          save(data).then((res) => {
            setReadonly();
            title.value = '详情';
            navBtnText.value = '编辑';
            btnFlag.value = 'edit';
            createMessage.success('修改成功');
          });
          break;
        default:
          break;
      }
    };

    function save(data) {
      return saveOnlineData(unref(code), unref(getFormHead).tableType, data);
    }

    id ? (title.value = '详情') : (title.value = '新增',navBtnText.value='');

    return {
      getFormSchema,
      title,
      register,
      handleSubmit,
      handleClick,
      btnText,
      navBtnText,
      btnFlag,
      btnShow,
    };
  },
};
</script>

<style  >
</style> 