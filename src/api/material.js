import request from "@/utils/request";

const material = {
  // 获取用户素材目录
  getFolders(uid) {
    return request({
      url: `/material-list/${uid}`,
      method: "get"
    });
  },
  // 增加用户素材目录
  addFolder(data, uid) {
    return request({
      url: `/material-list/${uid}`,
      method: "post",
      data
    });
  },
  // 修改目录名称
  updateFolder(data, mlid) {
    return request({
      url: `/material-list?mlid=${mlid}`,
      method: "patch",
      data
    });
  },
  // 删除用户素材目录
  deleteFolder(mlid) {
    return request({
      url: "/material-list",
      method: "delete",
      params: {
        mlid
      }
    });
  },
  // 获取我的装饰屋
  // 获取指定素材目录中的素材
  getMaterials(mlid) {
    return request({
      url: `/material`,
      method: "get",
      params: {
        mlid
      }
    });
  },
  // 添加素材
  uploadMore: function(uid, data) {
    return request({
      url: `/material/${uid}`,
      method: "post",
      data
    });
  },
  // 删除素材
  deleteMaterial(midList) {
    return request({
      url: `/material`,
      method: "delete",
      data: { midList }
    });
  }
};
export default material;
