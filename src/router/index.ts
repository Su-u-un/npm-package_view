import { createRouter, createWebHistory } from "vue-router";
import main from "../views/main.vue";
import Home from "../views/layout/components/Home.vue";

// 开发环境不使用懒加载
// 使用require对import进行拼接

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "main",
            component: main,
            children: [
                {
                    path: "/",
                    name: "首页",
                    component: Home,
                },
                {
                    path: "/tree",
                    name: "层次图",
                    component: () => import("../views/charts/tree.vue"),
                },
                {
                    path: "/forceDirect",
                    name: "力导图",
                    component: () => import("../views/charts/forceDirect.vue"),
                },
                {
                    path: "/sunburst",
                    name: "环状图",
                    component: () => import("../views/charts/sunburst.vue"),
                },
            ],
        },
    ],
});

export default router;
