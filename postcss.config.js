module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android >= 4.0',
        'iOS >= 7',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions',
      ],
      grid:true
    },
    'postcss-pxtorem': {
      rootValue: 37.5, // 75表示750设计稿，37.5表示375设计稿
      propList: ['*'],
    },
    // exclude: /web/i     //忽略 web下所有文件
  },
};
