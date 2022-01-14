import baseList from './src/index.vue';
import { withInstall } from '@/utils';


export { useTable, useTableInner } from './src/hooks/useTable';

export const BaseList = withInstall(baseList);

