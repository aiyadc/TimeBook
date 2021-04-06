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
  getUserInfo(uid){
      return request({
          url:`/user/${uid}`,
          method:'get'
      })
  }
  // 修改密码
  // 删除账号
  // 查找账号
  // 修改个人信息
};
export default user;
