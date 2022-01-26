import { ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
import { isInSetup } from '@/utils/helper/vueHelper';
import { isProdMode } from '@/utils/env';
import { getDynamicProps } from '@/utils';

export function useNav(props) {
  isInSetup();
  const navRef = ref(null);
  const loadedRef = ref(false);

  async function getNav() {
    const form = unref(navRef);
    if (!form) {
      error('尚未获得窗体实例，请在执行窗体操作时确保窗体已呈现!  ');
    }
    await nextTick();
    return form;
  }

  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        navRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(navRef)) return;
    navRef.value = instance;

    loadedRef.value = true;

    watchEffect(() => {
      props && instance.setProps(getDynamicProps(props));
    });
  }

  const methods = {
    // TODO promisify
    setFieldsValue: (values) => {
        const nav = await getNav();
        nav.setFieldsValue(values);
    },
  
  };

  return [register, methods];
}
