import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/template/index.vue")
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
      path: "/login",
      component: () => import("@/views/login")
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
