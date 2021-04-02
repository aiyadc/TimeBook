import request from "@/utils/request";
const album = {
    // 新建相册
    createAlbum(data, uid) {
        return request({
            url: `/album?uid=${uid}`,
            method: "post",
            data
        });
    },
    // 更新我的设计相册
    updateAlbum(data, uid) {
        return request({
            url: `/album?uid=${uid}`,
            method: "post",
            data
        });
    }
    // 获取我的设计相册
    // 修改我的设计相册
    // 删除我的设计相册
};
export default album