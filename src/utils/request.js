/* eslint-disable eol-last */
import axios from "axios";
import ElementUI from "element-ui";
import Cookies from "js-cookie";
const request = axios.create({
  timeout: 10000,
  baseURL: process.env.BASE_API,
  maxContentLength: 30000
});

// request interceptor
request.interceptors.request.use(
  config => {
    let token = Cookies.get("access_token") || "";
    config.headers["Authorization"] = token;
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// response interceptor
request.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    const errorWhiteList = ["/login"];
    if (!errorWhiteList.includes(location.hash.slice(1))) {
      ElementUI.Message.error(error.response.data.message);
    }
    return Promise.reject(error.response);
  }
);
export default request;
