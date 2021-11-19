import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue';
const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

export function entries(obj) {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

export function useAttrs(params = {}) {
  const instance = getCurrentInstance();
  if (!instance) return {};

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = params;
  const attrs = shallowRef({});
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []);

  // 因为attrs不是响应式的，所以让它响应式而不是在' onUpdated '钩子中执行以获得更好的性能  
  instance.attrs = reactive(instance.attrs);

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
        acm[key] = val;
      }

      return acm;
    }, {});

    attrs.value = res;
  });

  return attrs;
}
