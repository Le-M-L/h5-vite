import { ref, onUnmounted, unref } from 'vue';
import { error } from '@/utils/log';
import { isProdMode } from '@/utils/env';

export function useCalendar() {
  const calendarRef = ref(null);
  const loadedRef = ref(false);
  // 获取日历组件实例
  async function getInstance() {
    const calendar = unref(calendarRef);
    if (!calendar) {
      error('未获得到日历组件实例，请确保日历组件加载完成');
    }
    return calendar;
  }

  // 方法注册
  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        calendarRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(calendarRef)) return;
    calendarRef.value = instance;
    loadedRef.value = true;
  }

  const methods = {
    handleShow: async () => {
      const instance = await getInstance();
      instance.handleShow()
    },
  };

  return [register, methods];
}
