import { createRouter, createWebHistory } from 'vue-router'
import main from '../views/main.vue'
import Tree from '../views/charts/Tree.vue'
import Force_Directed from '../views/charts/Force_Directed.vue'
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
          path:'/Tree',
          name:'Tree',
          component:Tree
        },
        {
          path:'/Force_Directed',
          name:'Force_Directed',
          component:Force_Directed
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
