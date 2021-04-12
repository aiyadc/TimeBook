import request from "@/utils/request";
const text = {
  // 获取文案目录
  getFolders(search) {
    return request({
      url: `/text-folder?search=${search}`,
      method: "get"
    });
  },
  // 更新目录
  updateFolder(folderid, data) {
    return request({
      url: `/text-folder?folderid=${folderid}`,
      method: "patch",
      data
    });
  },
  // 删除目录
  deleteFolder(folderid) {
    return request({
      url: `/text-folder?folderid=${folderid}`,
      method: "delete"
    });
  },
  // 添加目录
  addFolder(data) {
    return request({
      url: "/text-folder",
      method: "post",
      data
    });
  },
  // 获取文案目录中的图片，0表示所有
  getTexts(params) {
    return request({
      url: `/text`,
      method: "get",
      params // folderid,search
    });
  },
  // 添加文案素材
  addTexts(data) {
    return request({
      url: `/text`,
      method: "post",
      data
    });
  },
  // 更新素材信息
  updateText(textid, data) {
    return request({
      url: `/text?textid=${textid}`,
      method: "patch",
      data
    });
  },
  // 单个/批量删除文案素材
  deleteTexts(data) {
    return request({
      url: `/text`,
      method: "delete",
      data
    });
  }
};
export default text;
