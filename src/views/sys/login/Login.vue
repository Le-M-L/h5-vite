<template>
  <div :class="prefixCls" class="p-0.5" >
    <span>事件处置</span>
    <Button @click="handleClick"> 点击 </Button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Field, CellGroup, Button } from 'vant';
import { useDesign } from '@/hooks/web/useDesign';
export default {
  components: {
    Field,
    Button,
  },
  setup() {
    const value = ref('');
    const { prefixCls } = useDesign('login');
    const handleClick = () => {
    
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
.DD-login {
  color: #ccc;
  >span{
    color: #333;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>