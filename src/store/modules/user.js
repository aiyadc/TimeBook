import Cookies from "@/utils/cookie.js";
import userRequest from "@/api/user.js";
export default {
  state: {
    uid: 0,
    isvip: 0,
    identity: "user"
  },
  getters: {},
  mutations: {
    SET_UID(state, val) {
      state.uid = val;
    },
    SET_ISVIP(state, val) {
      state.isvip = val;
    },
    SET_IDENTITY(state, val) {
      state.identity = val;
    },
    CLEAR_UID(state) {
      state.uid = null;
    }
  },
  actions: {
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        const token = Cookies.getToken();
        if (token && token.length) {
          userRequest
            .getUserInfo(token)
            .then(res => {
              commit("SET_UID", res.data.uid);
              localStorage.setItem("uid", res.data.uid);
              commit("SET_ISVIP", res.data.isvip);
              commit("SET_IDENTITY", res.data.identity);
              resolve(res);
            })
            .catch(err => {
              Cookies.removeToken();
              reject(err);
            });
        } else {
          reject("没有token");
        }
      });
    },
    LOGOUT({ commit }) {
      router.push("/login");
      Cookies.removeToken();
      commit("SET_UID", "");
    }
  }
};
