
<script>
import { toRefs } from 'vue';
import { createAppProviderContext } from './useAppContext';

const props = {
  /**
   * class style prefix
   */
  prefixCls: { type: String, default: 'DD' },
};
export default {
  name: 'AppProvider',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const { prefixCls } = toRefs(props);

    // 向全局注入变量
    createAppProviderContext({ prefixCls });
    return () => slots.default?.();
  },
};
</script>