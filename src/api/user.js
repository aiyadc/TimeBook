import request from "@/utils/request";
const user = {
  // 注册账号
  // 登录
  login(form) {
    return request({
      url: "/login",
      method: "post",
      data: form
    });
  },
  // 获取用户信息
  getUserInfo() {
    return request({
      url: `/user`,
      method: "get"
    });
  },
  // 判断是否登陆
  checkLogin() {
    return request({
      url: "/islogin",
      method: "post"
    });
  }
  // 修改密码
  // 删除账号
  // 查找账号
  // 修改个人信息
};
export default user;
