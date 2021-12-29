import { ref, onUnmounted, unref } from 'vue';
import { error } from '@/utils/log';
import { isProdMode } from '@/utils/env';
import { getDynamicProps } from '@/utils';

export function useSelect(props) {
  const selectRef = ref(null);
  const loadedRef = ref(false);
  // 获取日历组件实例
  async function getInstance() {
    const calendar = unref(selectRef);
    if (!calendar) {
      error('未获得到下拉框实例，请确保日历组件加载完成');
    }
    return calendar;
  }

  // 方法注册
  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        selectRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(selectRef)) return;
    selectRef.value = instance;
    loadedRef.value = true;
    props && instance.setProps(getDynamicProps(props));
  }

  const methods = {
    handleShow: async () => {
      const instance = await getInstance();
      instance.handleShow();
    },
    setProps: (props) => {
        getInstance().setProps(props);
    },
    // 数据点击回调
    handleBack(){
      getInstance().callback(props);
    }
  };

  return [register, methods];
}
