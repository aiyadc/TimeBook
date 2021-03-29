/* eslint-disable eol-last */
import axios from "axios";
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
        console.log("error----------", error); // for debug
        return Promise.reject(error);
    }
);
// response interceptor
request.interceptors.response.use(response => {
        console.log("this is res:", response);
        const res = response.data;
        return res;
    },
    error => {
        // Do something with request error
        // console.log("error response", error.response); // for debug
        return Promise.reject(error.response);
    });
export default request;