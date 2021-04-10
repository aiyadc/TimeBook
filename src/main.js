import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store";
import { setRem } from "@/utils/setRem.js";
import App from "./App";
import "./styles/index.scss";
import router from "./router";
import VConsole from "vconsole";

// new VConsole();

Vue.use(ElementUI);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    created() {
        setRem(375, 1200);
    }
});