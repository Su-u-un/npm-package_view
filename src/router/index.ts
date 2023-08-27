import { createRouter, createWebHistory } from 'vue-router'
import main from '../views/main.vue'
import Home from '../views/layout/components/Home.vue'


// 开发环境不使用懒加载
// 使用require对import进行拼接

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children:[
        {
          path:'/',
          name:'Home',
          component:Home
        },
        {
          path:'/tree',
          name:'tree',
          component:()=>import ('../views/charts/tree.vue')
        },
        {
          path:'/forceDirect',
          name:'forceDirect',
          component:()=>import ('../views/charts/forceDirect.vue')
        },
        {
          path:'/sunburst',
          name:'sunburst',
          component:()=>import ('../views/charts/sunburst.vue')
        }
      ]
    }
  ]
})

export default router
