export const prefixCls = 'DD';
const docEle = document.documentElement;

// 设置主题变量
export function setCssVar(prop, val, dom = docEle){
    dom.style.setProperty(prop, val);
}

// 主题配置
export const themeConfig = {
    // 颜色调色板
    '--van-black': '#000',
    // '--van-white': '#fff',
    // '--van-gray-1': '#f7f8fa',
    // '--van-gray-2': '#f2f3f5',
    // '--van-gray-3': '#ebedf0',
    // '--van-gray-4': '#dcdee0',
    // '--van-gray-5': '#c8c9cc',
    // '--van-gray-6': '#969799',
    // '--van-gray-7': '#646566',
    // '--van-gray-8': '#323233',
    // '--van-red': '#ee0a24',
    // '--van-blue': '#1989fa',
    // '--van-orange': '#ff976a',
    // '--van-orange-dark': '#ed6a0c',
    // '--van-orange-light': '#fffbe8',
    // '--van-green': '#07c160',
    // // 渐变颜色
    // '--van-gradient-red': 'linear-gradient(to right, #ff6034, #ee0a24)',
    // '--van-gradient-orange': 'linear-gradient(to right, #ffd01e, #ff8917)',
}

// // Component Colors
// --van-primary-color: var(--van-blue);
// --van-success-color: var(--van-green);
// --van-danger-color: var(--van-red);
// --van-warning-color: var(--van-orange);
// --van-text-color: var(--van-gray-8);
// --van-text-color-2: var(--van-gray-6);
// --van-text-color-3: var(--van-gray-5);
// --van-text-link-color: #576b95;
// --van-active-color: var(--van-gray-2);
// --van-active-opacity: 0.6;
// --van-disabled-opacity: 0.5;
// --van-background-color: var(--van-gray-1);
// --van-background-color-light: var(--van-white);

// // Padding
// --van-padding-base: 4px;
// --van-padding-xs: 8px;
// --van-padding-sm: 12px;
// --van-padding-md: 16px;
// --van-padding-lg: 24px;
// --van-padding-xl: 32px;

// // Font
// --van-font-size-xs: 10px;
// --van-font-size-sm: 12px;
// --van-font-size-md: 14px;
// --van-font-size-lg: 16px;
// --van-font-weight-bold: 500;
// --van-line-height-xs: 14px;
// --van-line-height-sm: 18px;
// --van-line-height-md: 20px;
// --van-line-height-lg: 22px;
// --van-base-font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
//   Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB',
//   'Microsoft Yahei', sans-serif;
// --van-price-integer-font-family: Avenir-Heavy, PingFang SC, Helvetica Neue,
//   Arial, sans-serif;

// // Animation
// --van-animation-duration-base: 0.3s;
// --van-animation-duration-fast: 0.2s;
// --van-animation-timing-function-enter: ease-out;
// --van-animation-timing-function-leave: ease-in;

// // Border
// --van-border-color: var(--van-gray-3);
// --van-border-width-base: 1px;
// --van-border-radius-sm: 2px;
// --van-border-radius-md: 4px;
// --van-border-radius-lg: 8px;
// --van-border-radius-max: 999px;

