import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vitePluginRequireTransform from 'vite-plugin-require-transform'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: false,
    host: '127.0.0.1',
    port: 5502,
    cors: true
  },
  css: {
    preprocessorOptions: {
        additionalData: '@import "@/assets/scss/globalVar.scss"; @import "@/assets/scss/globalMixin.scss";'
    }
}
})
