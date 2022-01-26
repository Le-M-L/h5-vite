import dNavbar from './src/index.vue';
import { withInstall } from '@/utils';
import { useSearch } from './src/hooks/useSearch';

// 查询导航栏
export { default as SearchNav } from './src/searchNav.vue';
// 记录
export { default as SearchHistory } from './src/searchHistory.vue';

// 导航栏
export const DNavbar = withInstall(dNavbar);

export { useSearch };
