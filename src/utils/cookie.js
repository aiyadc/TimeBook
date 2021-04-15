import Cookies from "js-cookie";
const KEY = "access_token";
export default {
  setToken(token) {
    Cookies.set(KEY, token);
  },
  getToken() {
    return Cookies.get(KEY);
  },
  removeToken() {
    Cookies.remove(KEY);
  }
};

// export default
