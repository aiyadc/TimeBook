import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/template"
    },
    {
      path: "/template",
      name: "template",
      component: () =>
        import(
          /* webpackChunkName: 'template' */ "@/views/user/template/index.vue"
        )
    },
    {
      path: "/identity-select",
      component: () => import("@/views/identityToggle.vue")
    },
    {
      path: "/diy/:aid",
      name: "diy",
      meta: {
        title: "相册DIY"
      },
      component: () => import("@/views/user/dIY/index")
    },
    {
      path: "/login",
      component: () => import("@/views/login")
    },
    {
      path: "/mine",
      component: () => import("@/views/user/mine/index.vue")
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
  if (publicURL.includes(to.path)) {
    next();
  } else {
    if (store.state.user.uid != 0) {
      next();
    } else {
      store
        .dispatch("getUserInfo")
        .then(() => {
          next();
        })
        .catch(() => {
          next("/login");
        });
    }
  }
});

export default router;
