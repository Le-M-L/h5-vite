<template>
  <RouterView>
    <template #default="{ Component, route }">
      <keep-alive v-if="openCache" :include="getCaches">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
      <component v-else :is="Component" :key="route.fullPath" />
    </template>
  </RouterView>
  <!-- v-if="getCanEmbedIFramePage" -->
  <FrameLayout />
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import FrameLayout from '@/layouts/iframe/index.vue';
import { useAppStore } from '@/store/modules/app';

export default defineComponent({
  name: 'PageLayout',
  components: { FrameLayout },
  setup() {
    const appStore = useAppStore();
    const openCache = ref(true);

    const getCaches = computed(() => {
      return appStore.getCachedList;
    });

    return {
      getCaches,
      openCache,
    };
  },
});
</script>
