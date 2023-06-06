import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import requireTransform from 'vite-plugin-require-transform';
// import electronRenderer from "vite-plugin-electron/renderer";
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    requireTransform(),
    vue()
  ],
  base: './',
  resolve: {
    //配置别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // vue3 移除了process.env，需要重新定义
  define: {
    'process.env': {
      VUE_APP_PLATFORM: 'h5',
      VUE_APP_BASE_API: "http://localhost:8021/api"// src\libs\components\element\upload\upload.vue需要定义上传路径
    }
  },

})
