import Vue from "vue";
import Vuex from "vuex";

// 聚合modules中各模块
const files = require.context("./modules", false, /\.js$/);
let storeModules = {};
files.keys().forEach(key => {
  storeModules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

Vue.use(Vuex);
export default new Vuex.Store({
  modules: storeModules,
  state: {
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
    }
  }
});
