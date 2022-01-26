<template>
  <div class="base-btn-wrap">
    <slot>
      <Button type="primary" block @click="handleClick">
        {{ text }}
      </Button>
    </slot>
  </div>
  <div v-if="placeholder" class="base-btn-wrap-placeholder"></div>
</template>

<script>
import { Button } from 'vant';
export default {
  name: 'BtnWrap',
  components: { Button },
  props: {
    text: {
      type: String,
      default: '',
    },
    placeholder: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['click'],
  setup(_, { emit }) {
    const handleClick = () => emit('click');
    return {
      handleClick,
    };
  },
};
</script>

<style lang="less" scoped >
// 提交按钮外部盒子样式
.base-btn-wrap{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: @btnWrapHeight;
  padding: 8px 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  display: flex;
  z-index: 1001;
}

// 提交按钮对应占位样式
.base-btn-wrap-placeholder{
  height: @btnWrapHeight;
}

</style>