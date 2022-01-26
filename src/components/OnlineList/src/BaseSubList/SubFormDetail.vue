<template>
  <OnlineForm :params="params" :isRecord="false" :flag="false" />
</template>

<script>
import { computed } from 'vue';
import OnlineForm from '@/components/OnlineForm/src/index.vue';
import { useAppStoreWithOut } from '@/store/modules/app';
import { useOnlineStoreWithOut } from '@/store/modules/online';
export default {
  name: 'OnLineSubFormDetail',
  components: { OnlineForm },
  setup() {
    const appStore = useAppStoreWithOut();
    const onlineStore = useOnlineStoreWithOut();
    const params = computed(() => {
      let foreignKeys = onlineStore.getOnlineSunMain.foreignKeys;
      let data = appStore.getRowData;
      let obj = {};
      for (let item of foreignKeys) {
        // 保存参数
        obj[item.field] = data[item.key];
      }
      return obj;
    });
    return {
      params,
    };
  },
};
</script>

<style>
</style>