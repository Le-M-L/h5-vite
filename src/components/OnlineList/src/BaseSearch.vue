<template>
  <SearchNav @register="register1" @search="onSearch" @focus="onFocus" />
  <!-- 搜索记录 -->
  <SearchHistory v-if="isSearch" :code="code" @search="onSearch" />
  <BaseList
    v-else
    @register="register"
    :code="code"
    :columns="columns"
    :dictOptions="dictOptions"
    :params="getQueryParams"
    @row-click="onRowClick"
  />
</template>

<script>
import { computed, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SearchNav, SearchHistory, useSearch } from '@/components/DNavbar';
import BaseList from './BaseList.vue';
import { useColumns } from './hooks/useColumns';
import { useTableParam } from './hooks/useTableParam';
import { useTable } from './hooks/useTable';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { useAppStoreWithOut } from '@/store/modules/app';
export default {
  components: {
    BaseList,
    SearchNav,
    SearchHistory,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isSearch = ref(true);
    const searchValue = ref('');
    const onlineStore = useOnlineStoreWithOut();
    const appStore = useAppStoreWithOut();
    const { code } = route.params;
    const { type } = route.query;
    const main = type == 'subForm' ? onlineStore.getOnlineSunMain : onlineStore.getOnlineMain;

    const { dictOptions, columns, queryColumns, searchColumns } = useColumns({
      code: unref(code),
      main: main,
      immediate: false,
    });

    const { getQueryParam } = useTableParam({ main: main, immediate: true });

    const [register, { onReset }] = useTable();
    const [register1, { setFieldsValue }] = useSearch();

    const getQueryParams = computed(() => {
      return {
        ...unref(queryColumns),
        ...unref(getQueryParam),
        ...(unref(searchColumns).field ? { [unref(searchColumns).field]: searchValue.value } : {}),
      };
    });

    const onSearch = (val) => {
      if (val.value) {
        appStore.setSearchRecord({ code, value: val.value, flag: 'add' });
      }
      setFieldsValue(val.value);
      searchValue.value = val.value;
      isSearch.value = false;
    };

    const onRowClick = (item) => {
      switch (type) {
        case 'subForm':
          router.push(`/online/subDetail/${unref(code)}/${item.id}`);
          break;
        default:
          router.push(`/online/detail/${code}/${item.id}`);
          break;
      }
    };

    const onFocus = () => {
      isSearch.value = true;
    };

    return {
      code,
      isSearch,
      onFocus,
      dictOptions,
      columns,
      getQueryParams,
      onRowClick,
      onSearch,
      register,
      register1,
    };
  },
};
</script>
