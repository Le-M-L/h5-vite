import { computed } from 'vue';

import { useAppStore } from '@/store/modules/app';

export function useTransitionSetting() {
  const appStore = useAppStore();

  const getOpenPageLoading = computed(() => {
    return !!appStore.getTransitionSetting?.openPageLoading;
  });

  return {

    getOpenPageLoading,
  };
}
