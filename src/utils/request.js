/* eslint-disable eol-last */
import axios from 'axios';
import Cookies from 'js-cookie';

const request = axios.create({
    timeout: 5000,
    baseURL: process.env.BASE_API,
    // baseURL: "http://localhost:3000",
    // withCredentials: true, // 跨域带cookie
})

// request interceptor
request.interceptors.request.use(
    // config => {
    //     config.headers['Authorization'] = Cookies.get('access_token');
    //     return config;
    // },
    // error => {
    //     // Do something with request error
    //     console.log(error); // for debug
    //     Promise.reject(error);
    // }
);
// response interceptor
request.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        return res
            //       // if the custom code is not 20000, it is judged as an error.
            //       if (res.code !== 20000) {
            //         Message({
            //           message: res.message || 'Error',
            //           type: 'error',
            //           duration: 5 * 1000
            //         })

        //         // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        //         if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        //           // to re-login
        //           MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //             confirmButtonText: 'Re-Login',
        //             cancelButtonText: 'Cancel',
        //             type: 'warning'
        //           }).then(() => {
        //             store.dispatch('user/resetToken').then(() => {
        //               location.reload()
        //             })
        //           })
        //         }
        //         return Promise.reject(new Error(res.message || 'Error'))
        //       } else {
        //         return res
        //       }
        //     },
        //     error => {
        //       console.log('err' + error) // for debug
        //       Message({
        //         message: error.message,
        //         type: 'error',
        //         duration: 5 * 1000
        //       })
        //       return Promise.reject(error)
    }
)
export default request