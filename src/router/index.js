import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/home/index.vue")
    },
    {
      path: "/diy/:aid",
      name: "diy",
      meta: {
        title: "相册DIY"
      },
      component: () => import("@/views/DIY/index")
    },
    {
      path: "/wechatbg",
      component: () => import("../test/wechat_bg.vue")
    },
    {
      path: "/mutation",
      component: () => import("../test/testMutationObserver.vue")
    },
    {
      path: "/login",
      component: () => import("@/views/Login")
    },
    {
      path: "/test",
      component: () => import("@/test/test.vue")
    },
    {
      path: "/worker",
      component: () => import("@/test/worker.vue")
    },
    {
      path: "/album",
      component: () => import("@/test/cameras-and-albums")
    },
    {
      path: "/mine",
      component: () => import("@/views/mine/index.vue")
    }
  ]
});
router.beforeEach((to, from, next) => {
  const publicURL = ["/login"];
  console.log("store.state.uid :>> ", store.state.uid);
  if (!publicURL.includes(to.path)) {
    if (store.state.uid == 0) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
