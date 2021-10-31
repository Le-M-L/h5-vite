<template>
  <ConfigProvider>
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script setup >
import { ConfigProvider } from 'vant';
import { AppProvider } from '@/components/Application';
import { useTitle } from '@/hooks/web/useTitle';

useTitle();
</script>
