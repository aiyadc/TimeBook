/* eslint-disable eol-last */
import axios from "axios";
import ElementUI from 'element-ui';
const request = axios.create({
  timeout: 5000,
  // baseURL: process.env.BASE_API,
  baseURL: "http://127.0.0.1:7001",
  maxContentLength: 30000,
  // withCredentials: true, // 跨域可携带cookie
});

// request interceptor
request.interceptors.request.use(
  config => {
    //   config.headers['Authorization'] = Cookies.get('access_token');
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// response interceptor
request.interceptors.response.use(response => {
    const res = response.data;
    return res;
  },
  error => {
    // Do something with request error
    // console.log("error response", error.response); // for debug
    // console.log('error.response :>> ', error.response);
    ElementUI.Message.error(error.response.data.message)
    return Promise.reject(error.response);
  });
export default request;
