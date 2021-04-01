import request from "@/utils/request";
const template = {
  // 获取主题
  getFolders(tid) {
    return request({
      url: '/theme',
      method: 'get',
    })
  },
  // 增加主题
  addFolder(data) {
    return request({
      url: '/theme',
      method: 'post',
      data
    })
  },
  // 修改主题名称  
  updateFolder(data,tid) {
    return request({
      url: `/theme?tid=${tid}`,
      method: 'patch',
      data
    })
  },
  // 删除主题
  deleteTheme(tid) {
    return request({
      url: `/theme?tid=${tid}`,
      method: 'delete',
    })
  }
};
export default template