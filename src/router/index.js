import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
        path: "/",
        name: "Home",
        component: () =>
            import ("../views/canvas.vue"),
    },
    {
        path: "/test",
        name: "test",
        component: () =>
            import ("../views/test.vue"),
    },
    {
        path: '/wechatbg',
        component: () =>
            import ("../views/wechat_bg.vue")
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;