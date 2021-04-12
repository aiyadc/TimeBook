import request from "@/utils/request";
const theme = {
  // 获取主题
  fetchThemes(search = "") {
    return request({
      url: `/theme?search=${search}`,
      method: "get"
    });
  },
  // 增加主题
  addTheme(data) {
    return request({
      url: "/theme",
      method: "post",
      data
    });
  },
  // 更新主题信息
  updateTheme(tid, data) {
    return request({
      url: `/theme?tid=${tid}`,
      method: "patch",
      data
    });
  },
  // 删除主题
  deleteTheme(tid) {
    return request({
      url: `/theme?tid=${tid}`,
      method: "delete"
    });
  }
};
export default theme;
