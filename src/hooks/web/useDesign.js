import { useAppProviderContext } from '@/components/Application';

export function useDesign(scope) {
  const values = useAppProviderContext();

  return {
    // prefixCls: computed(() => `${values.prefixCls}-${scope}`),
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
    // style,
  };
}
