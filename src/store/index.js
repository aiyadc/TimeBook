import Vue from "vue";
import Vuex from "vuex";
import Cookies from "@/utils/cookie.js";
import router from "@/router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    uid: 0,
    platform: "",
    TStack: [] // 画布复制对象暂存区
  },
  getters: {},
  mutations: {
    SET_PLATEFORM(state, val) {
      state.platform = val;
    },
    Push_TStack(stack, obj) {
      stack.TStack = [];
      if (Object.prototype.toString.call(obj) === "[object Object]") {
        stack.TStack.push(obj);
      } else {
        stack.TStack.push(...obj);
      }
    },
    Pop_TStack(stack) {
      stack.TStack = [];
    },
    SET_UID(state, val) {
      state.uid = val;
    },
    CLEAR_UID(state) {
      state.uid = null;
    }
  },
  actions: {
    LOGOUT({ commit }) {
      router.push("/login");
      Cookies.removeToken();
      commit("SET_UID", "");
    }
  }
});
