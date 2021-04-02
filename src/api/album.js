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
    updateAlbum(data, aid) {
        return request({
            url: `/album?aid=${aid}`,
            method: "patch",
            data
        });
    },
    // 获取相册信息
    getAlbumInfo(aid){
        return request({
            url:`/album?aid=${aid}`,
            method:'get'
        })
    }
    // 修改我的设计相册
    // 删除我的设计相册
};
export default album