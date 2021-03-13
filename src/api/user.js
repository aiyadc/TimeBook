import request from "@/utils/request";

const user = {
  // 注册账号
  // 登录
  login: function(form) {
    return request({
      url: "/login",
      method: "post",
      data: form
    });
  }
  // 修改密码
  // 删除账号
  // 查找账号
  // 修改个人信息
};
export default user;
