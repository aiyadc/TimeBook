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
    },

    /**
     * Manage
     */
    // 拉取所有用户
    fetchUserList(params) {
        return request({
            url: `/user-list`,
            method: "get",
            params
        });
    },
    // 修改用户信息
    updateUserInfo(uid) {
        return request({
            url: `/user?uid=${uid}`,
            method: "patch"
        });
    },
    // 删除用户
    deleteUser(uid) {
        return request({
            url: `/user?uid=${uid}`,
            method: 'delete'
        })
    },
    // 查找用户
    searchUsers(params) {
        return request({
            url: '/user-list',
            method: 'get',
            params // {account,mobile,mail,nickname,address}
        })
    }
    // 修改密码
    // 删除账号
    // 查找账号
    // 修改个人信息
};
export default user;