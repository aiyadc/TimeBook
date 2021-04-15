import Vue from "vue";
import userRequest from "@/api/user.js";
import Cookies from "js-cookie";
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
      path: "/diy",
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
    },
    {
      path: "/diy-manage",
      name: "diy-manage",
      component: () => import("@/views/manage/layout.vue"),
      children: [
        {
          path: "home",
          component: () => import("@/views/manage/home.vue")
        },
        {
          path: "decoration/material",
          component: () => import("@/views/manage/decoration.vue")
        },
        {
          path: "decoration/sort",
          component: () => import("@/views/manage/decorationFolder")
        },
        {
          path: "font",
          component: () => import("@/views/manage/font.vue")
        },
        {
          path: "template",
          component: () => import("@/views/manage/template.vue")
        },
        {
          path: "sentence/material",
          component: () => import("@/views/manage/text")
        },
        {
          path: "sentence/sort",
          component: () => import("@/views/manage/textFolder")
        },
        {
          path: "theme",
          component: () => import("@/views/manage/theme.vue")
        },
        {
          path: "user",
          component: () => import("@/views/manage/user.vue")
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicURL = ["/login"];
  console.log("store.state.user.uid :>> ", store.state.user.uid);
  if (publicURL.includes(to.path)) {
    next();
  } else {
    if (store.state.user.uid != 0) {
      next();
    } else {
      console.log("需要重置uid");
      console.log("promise:", store.dispatch("getUserInfo"));
      store
        .dispatch("getUserInfo")
        .then(() => {
          console.log("reset store.state.user.uid :>> ", store.state.user.uid);
          next();
        })
        .catch(() => {
          next("/login");
        });
    }
  }
});

export default router;
