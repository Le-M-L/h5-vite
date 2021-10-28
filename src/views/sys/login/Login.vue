<template>
  <div :class="prefixCls">
    <Button @click="handleClick"> 点击 </Button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Field, CellGroup, Button } from 'vant';
import { useDesign } from '@/hooks/web/useDesign';
import { useMessage } from '@/hooks/web/useMessage';
import { defHttp } from '@/utils/http/axios';
export default {
  components: {
    Field,
    Button,
  },
  setup() {
    const value = ref('');
    const { prefixCls } = useDesign('login');
    const { createMessage, notification, createConfirm, createAlertDialog } = useMessage()
    const handleClick = () => {
     createConfirm({
       content:'<div class="ddd" >666</div>'
     })
    };
    return {
      prefixCls,
      value,
      handleClick,
    };
  },
};
</script>

<style lang="less">
.dd {
  color: #ccc;
  font-size: 2rem;
}
</style>