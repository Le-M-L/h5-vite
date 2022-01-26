<template>
  <div :class="prefixCls" class="p-0.5">
    <span>事件处置</span>
    <Button @click="handleClick"> 点击 </Button>
    <div> 用户名：<Field v-model="form.username" /> 密码：<Field v-model="form.password" /> </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { Field, CellGroup, Button } from 'vant';
import { useDesign } from '@/hooks/web/useDesign';
import { useUserStoreWithOut } from '@/store/modules/user';
import { encryptBySha1 } from "@/utils/cipher"
export default {
  components: {
    Field,
    Button,
  },
  setup() {
    const value = ref('');
    const form = reactive({
      username: 'lml',
      password: encryptBySha1('dingdang123456?') ,
    });
    const { prefixCls } = useDesign('login');
    const userStore = useUserStoreWithOut()
    const handleClick = () => {
      userStore.login(form)
        .then(res =>{
            console.log(res)
        })
    };
    return {
      prefixCls,
      value,
      handleClick,
      form,
    };
  },
};
</script>

<style lang="less">
.DD-login {
  color: #ccc;
  > span {
    color: #333;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
