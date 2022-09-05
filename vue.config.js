const { defineConfig } = require('@vue/cli-service');

const isProd = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: isProd ? 'warning' : 'default',

  outputDir: isProd ? '../bitrix/bx-site/dist' : 'dist',
  assetsDir: isProd ? '../dist/' : '',
  indexPath: isProd ? 'index.php' : 'index.html',

  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_CLIENT_BASE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api': '/' },
      },
    },
  },
});
