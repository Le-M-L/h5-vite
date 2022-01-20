<template>
  <DNavbar />
  <BaseList
    :code="code"
    :columns="columns"
    :dictOptions="dictOptions"
    :params="getQueryParam"
    @row-click="onRowClick"
  />
</template>

<script>
import { ref, unref } from 'vue';
import { useRoute } from 'vue-router';
import DNavbar from '@/components/DNavbar.vue';
import BaseList from './BaseList.vue';
import { useColumns } from './hooks/useColumns';
import { useOnlineStoreWithOut } from '@/store/modules/online';
export default {
  components: {
    BaseList,
    DNavbar,
  },
  setup() {
    const route = useRoute();
    const onlineStore = useOnlineStoreWithOut();
    const { code } = route.params;

    const { dictOptions, columns, queryColumns } = useColumns({
      code: unref(code),
      main: onlineStore.getOnlineMain,
      immediate: false,
    });

    const onRowClick = (item) => {
      console.log(item);
    };

    return {
      code,
      dictOptions,
      columns,
      queryColumns,
      onRowClick,
    };
  },
};
</script>

<style>
</style>