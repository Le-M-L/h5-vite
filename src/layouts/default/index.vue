<template>
  <div :class="prefixCls">
    <LayoutContent />
  </div>
</template>

<script>
import LayoutContent from './content/index.vue';
import { useDesign } from '@/hooks/web/useDesign';

export default {
  components: { LayoutContent },
  setup() {
    const { prefixCls } = useDesign('default-layout');
    return {
      prefixCls,
    };
  },
};
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-default-layout';

.@{prefix-cls} {
  display: flex;
  width: 100%;
  min-height: 100%;
  background-color: @content-bg;
  flex-direction: column;
  >div{
    min-height: 100%;
  }
}
</style>