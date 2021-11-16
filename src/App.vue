<template>
  <ConfigProvider :theme-vars="themeVars">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script setup >
import { ConfigProvider } from 'vant';
import { AppProvider } from '@/components/Application';
import { useTitle } from '@/hooks/web/useTitle';
  const themeVars = {
      dialogHeaderPaddingTop: '12px', // 弹窗顶部留白
      dialogButtonHeight:'50px',// 弹窗底部按钮高度
      dialogHeaderFontWeight: '600', // 弹窗 头部文字加粗
      dialogConfirmButtonTextColor:'#2F54EB', //弹窗底部 提交文字颜色
      // dialogFontSize:'18px'
    }
useTitle();
</script>