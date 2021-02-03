import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    routes: [{
            path: "/",
            name: "Home",
            component: () =>
                import ("../test/test.vue"),
        },
        {
            path: '/wechatbg',
            component: () =>
                import ("../test/wechat_bg.vue")
        },
        {
            path: '/mutation',
            component: () =>
                import ("../test/testMutationObserver.vue")

        }
    ]
})