import Cookies from "js-cookie";
const KEY = "access_token";
export default {
    setToken(token) {
        console.log(Cookies.set);
        Cookies.set(KEY, token);
    },
    removeToken() {
        Cookies.remove(KEY);
    }
};

// export default