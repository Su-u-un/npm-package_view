import { createRouter, createWebHistory } from 'vue-router'

// 开发环境不使用懒加载
// 使用require对import进行拼接
const _import = require('./import-' + process.env.NODE_ENV)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: _import('main'),
      children:[
        {
          path:'/Tree',
          component:_import('Tree')
        }
      ]
    }
  ]
})

export default router
