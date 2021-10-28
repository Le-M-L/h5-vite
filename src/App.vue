<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup >
import { AppProvider } from '@/components/Application';
import { useTitle } from '@/hooks/web/useTitle';

useTitle();
</script>

<style>
</style>
