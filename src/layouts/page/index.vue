<template>
  <RouterView>
    <template #default="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script>
import { computed, defineComponent, unref } from 'vue';

import FrameLayout from '@/layouts/iframe/index.vue';

import { useRootSetting } from '@/hooks/setting/useRootSetting';

import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
// import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';

export default defineComponent({
  name: 'PageLayout',
  components: { FrameLayout },
  setup() {
    // const { getShowMultipleTab } = useMultipleTabSetting();

    const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

    const { getBasicTransition, getEnableTransition } = useTransitionSetting();

    // const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));
    const openCache = computed(() => unref(getOpenKeepAlive));

    return {
      openCache,
      getEnableTransition,
      getBasicTransition,
      getCanEmbedIFramePage,
    };
  },
});
</script>
