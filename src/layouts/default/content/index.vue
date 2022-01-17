<template>
  <div :class="[prefixCls]">
    <PageLayout />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import PageLayout from '@/layouts/page/index.vue';
import { useDesign } from '@/hooks/web/useDesign';
import { useContentViewHeight } from './useContentViewHeight';

export default defineComponent({
  name: 'LayoutContent',
  components: { PageLayout },
  setup() {
    const { prefixCls } = useDesign('layout-content');
    useContentViewHeight();
    return {
      prefixCls,
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-layout-content';

.@{prefix-cls} {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}
</style>
