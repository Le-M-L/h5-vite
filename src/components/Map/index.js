import { withInstall } from '@/utils';
import customMap from './src/index.vue';
export { default as BasicMap } from "./src/BasicMap.vue"
export const CustomMap = withInstall(customMap);
