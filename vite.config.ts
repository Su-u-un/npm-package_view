import { fileURLToPath, URL } from 'node:url'
import {resolve} from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  build:{
    rollupOptions:{
      input:{
        main:resolve(__dirname, 'test/index.html'),
      }
    }
  },
  hmr: {
    clientPort : 443
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  proxy: {
    '/api': {
      target: 'http://localhost:5501/',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
  server: {
    https: false,
    host: '0.0.0.0',
    port: 5500,
    cors: true
  },
  css: {
    preprocessorOptions: {
        additionalData: '@import "@/assets/scss/globalVar.scss"; @import "@/assets/scss/globalMixin.scss";'
    }
}
})
