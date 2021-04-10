import Vue from "vue";
import userRequest from "@/api/user.js";
import Cookies from "js-cookie";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const router = new Router({
    routes: [{
            path: "/",
            name: "Home",
            component: () =>
                import ("@/views/template/index.vue")
        },
        {
            path: "/diy/:aid",
            name: "diy",
            meta: {
                title: "相册DIY"
            },
            component: () =>
                import ("@/views/DIY/index")
        },
        {
            path: "/login",
            component: () =>
                import ("@/views/login")
        },
        {
            path: "/album",
            component: () =>
                import ("@/test/cameras-and-albums")
        },
        {
            path: "/mine",
            component: () =>
                import ("@/views/mine/index.vue")
        },
        {
            path: "/diy-manage",
            name: "diy-manage",
            component: () =>
                import ("@/views/manage/layout.vue"),
            children: [{
                    path: "home",
                    component: () =>
                        import ('@/views/manage/home.vue')
                },
                {
                    path: "decoration",
                    component: () =>
                        import ("@/views/manage/decoration.vue")
                },
                {
                    path: "font",
                    component: () =>
                        import ("@/views/manage/font.vue")
                },
                {
                    path: "template",
                    component: () =>
                        import ("@/views/manage/template.vue")
                },
                {
                    path: 'sentence',
                    component: () =>
                        import ('@/views/manage/sentence')
                },
                {
                    path: "theme",
                    component: () =>
                        import ("@/views/manage/theme.vue")
                },
                {
                    path: "user",
                    component: () =>
                        import ("@/views/manage/user.vue")
                }
            ]
        }
    ]
});
// router.beforeEach((to, from, next) => {
//   const publicURL = ["/login"];
//   console.log("store.state.uid :>> ", store.state.uid);
//   if (!publicURL.includes(to.path)) {
//     if (store.state.uid == 0) {
//       next("/login");
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });
router.beforeEach((to, from, next) => {
    const publicURL = ["/login"];
    console.log("store.state.uid :>> ", store.state.uid);
    if (publicURL.includes(to.path)) {
        next();
    } else {
        if (store.state.uid != 0) {
            next();
        } else {
            const token = Cookies.get("access_token");
            console.log("token :>> ", token);
            if (token && token.length) {
                userRequest
                    .getUserInfo(token)
                    .then(res => {
                        store.commit("SET_UID", res.data.uid);
                        console.log("store.state.uid :>> ", store.state.uid);
                        next();
                    })
                    .catch(err => {
                        console.log("err :>> ", err);
                        next("/login");
                    });
            } else {
                next("/login");
            }
        }
    }
});

export default router;