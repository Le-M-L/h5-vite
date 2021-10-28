/**
 * Notify 消息通知
 * Dialog 弹窗层
 * Toast  轻提示
 */
import { Toast, Dialog, Notify } from 'vant';
import { isString } from '@/utils/is';

function renderContent({ content }) {
  if (isString(content)) {
    return () => <div innerHTML={`<div>${content}</div>`}></div>
  } else {
    return content;
  }
}

// 创建弹窗配置
function createModalOptions(options) {
  return {
    ...options,
    message: renderContent(options),
  };
}

// 创建成功弹出层
function createAlertDialog(options) {
  return Dialog.alert(createModalOptions(options));
}

/**
 * @description: 创建带取消弹窗
 */
function createConfirm(options) {
  return Dialog.confirm(createModalOptions(options))
}

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: Toast,
    notification: Notify,
    createConfirm: createConfirm,
    createAlertDialog,
  };
}
