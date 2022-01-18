<template>
  <ConfigProvider style="height:100%" :theme-vars="themeVars">
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
  dialogButtonHeight: '50px', // 弹窗底部按钮高度
  dialogHeaderFontWeight: '600', // 弹窗 头部文字加粗
  dialogConfirmButtonTextColor: '#2F54EB', //弹窗底部 提交文字颜色
  buttonDefaultHeight:'36px', // 按钮 默认高度
  // buttonPrimaryColor:'#2f54eb',
  buttonPrimaryBackgroundColor:'#2f54eb',  // 按钮 Primary类型 背景颜色
  buttonPrimaryBorderColor:'#2f54eb', // 按钮 Primary类型 边框颜色
  // dialogFontSize:'18px'
};
useTitle();
</script>