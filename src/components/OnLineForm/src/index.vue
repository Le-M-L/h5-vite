<template>
  <DNavbar :title="title" />
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
export default {
  name: 'OnLineForm',
  inheritAttrs: false,
  components: { BasicForm, Button, DNavbar },
  props: {
    schemas: {
      type: Array,
      default: () => [],
    },
    isRecord:{
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { code, id } = route.params;
    const title = ref('新增');
    const onlineStore = useOnlineStoreWithOut();

    const [register, { setFieldsValue, submit }] = useForm({});
    const { getFormSchema } = useColumns(props, {
      code,
      id,
      setFieldsValue,
    });

    const btnText = computed(() => (id && onlineStore.getOnlineSubList?.length ? '记录' : '提交'));
    const btnShow = computed(() => (id && onlineStore.getOnlineSubList?.length) || !id);

    const handleSubmit = async () => {
      if (!id) {
        let data = await submit();
      } else if (onlineStore.getOnlineSubList?.length) {
        // 在线表单子集
        router.push(`/online/cgformErpSubList/${id}`);
      }
    };

    return {
      getFormSchema,
      title,
      register,
      handleSubmit,
      btnText,
      btnShow,
    };
  },
};
</script>

<style  >
</style> 