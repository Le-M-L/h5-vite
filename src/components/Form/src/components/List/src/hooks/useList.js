import { ref, unref, onUnmounted } from 'vue';
import { getDynamicProps } from '@/utils';
import { isProdMode } from '@/utils/env';

export function useList(props) {
  const listRef = ref(null);
  const loadedRef = ref(false);

  async function getInstance() {
    const calendar = unref(listRef);
    if (!calendar) {
      error('未获取到List 实例');
    }
    return calendar;
  }

  // 方法注册
  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        listRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(listRef)) return;
    listRef.value = instance;
    loadedRef.value = true;
    props && instance.setProps(getDynamicProps(props));
  }

  const methods = {
    handlePopup: async () => {
      const instance = await getInstance();
      instance.handlePopup();
    },
    handleClose: async () => {
      const instance = await getInstance();
      instance.handleClose();
    },
    setProps: async (props) => {
      const instance = await getInstance();
      instance.setProps(props);
    },
    onReset:  async (params) => {
      const instance = await getInstance();
      instance?.onReset(params);
    },
    setCheckArr:async (arr) => {
      const instance = await getInstance();
      instance.setCheckArr(arr);
    },
  };

  return [register, methods];
}
