<template>
  <div :class="prefixCls">
    <LayoutContent />
  </div>
</template>

<script>
import { unref } from "vue";
import LayoutContent from './content/index.vue';
import { useDesign } from '@/hooks/web/useDesign';
import { listenerRouteChange } from '@/utils/logics/mitt/routeChange';
import { REDIRECT_NAME } from '@/router/constant';
import { useUserStore } from '@/store/modules/user';
import { useAppStoreWithOut } from '@/store/modules/app';
import { useRouter } from 'vue-router';

export default {
  components: { LayoutContent },
  setup() {
    const { prefixCls } = useDesign('default-layout');
    const userStore = useUserStore();
    const appStore = useAppStoreWithOut();
    const router = useRouter();

    // 监听路由变化 进行缓存
    listenerRouteChange((route) => {
      const { name } = route;
      if (name === REDIRECT_NAME || !route || !userStore.getToken) {
        return;
      }

      const { meta = {} } = route;
      // currentActiveMenu 当前缓存菜单
      const { currentActiveMenu } = meta;
      if (currentActiveMenu) {
        const findParentRoute = router.getRoutes().find((item) => item.path === currentActiveMenu);
        findParentRoute && appStore.addCache(findParentRoute);
      } else {
        appStore.addCache(unref(route));
      }
    });
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
  > div {
    min-height: 100%;
  }
}
</style>