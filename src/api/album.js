import request from "@/utils/request";
const album = {
    // 新建我的相册
    createAlbum(data, uid, aid = 0) {
        return request({
            url: `/album/user/${uid}`,
            method: "post",
            data,
            params: { aid }
        });
    },
    // 获取我的相册
    getMyAlbums(uid) {
        return request({
            url: `/album/user/${uid}`,
            method: "get"
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
    // 删除我的相册
    deleteAlbum(uid, aid) {
        return request({
            url: `/album/user/${uid}`,
            method: "delete",
            params: { aid }
        });
    },
    // 获取相册信息
    getAlbumInfo(aid) {
        return request({
            url: `/album?aid=${aid}`,
            method: "get"
        });
    },
    // 获取相册预览信息
    getReviewInfo(aid) {
        return request({
            url: `/album/review?aid=${aid}`,
            method: "get"
        });
    },
    // 获取模板相册
    getAlbumTemplateList(params) {
        return request({
            url: `/album/template`,
            method: "get",
            params // tid,currentPage,pageSize
        });
    }
    // 修改我的设计相册
    // 删除我的设计相册
};
export default album;