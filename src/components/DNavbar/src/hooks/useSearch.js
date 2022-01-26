import { ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
import { isInSetup } from '@/utils/helper/vueHelper';
import { isProdMode } from '@/utils/env';
import { getDynamicProps } from '@/utils';

export function useSearch(props) {
  isInSetup();
  const searchRef = ref(null);
  const loadedRef = ref(false);

  async function getSearch() {
    const form = unref(searchRef);
    if (!form) {
      error('尚未获得窗体实例，请在执行窗体操作时确保窗体已呈现!  ');
    }
    await nextTick();
    return form;
  }

  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        searchRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(searchRef)) return;
    searchRef.value = instance;

    loadedRef.value = true;

    watchEffect(() => {
      props && instance.setProps(getDynamicProps(props));
    });
  }

  const methods = {
    // TODO promisify
    setFieldsValue: async (values) => {
        const search = await getSearch();
        search.setFieldsValue(values);
    },
  
  };

  return [register, methods];
}
