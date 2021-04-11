import request from "@/utils/request";
const decoration = {
    // 获取装饰目录
    getFolders() {
        return request({
            url: "/decoration-folder",
            method: "get"
        });
    },
    // 更新目录
    updateDecotaionList(folderid, data) {
        return request({
            url: `/decoration-folder?folderid=${folderid}`,
            method: "patch",
            data
        });
    },
    // 删除目录
    deleteDecotaionList(folderid) {
        return request({
            url: `/decoration-folder?folderid=${folderid}`,
            method: "patch"
        });
    },
    // 获取装饰目录中的图片，0表示所有
    getDecorations(params) {
        return request({
            url: `/decoration`,
            method: "get",
            params // folderid,search
        });
    },
    // 添加装饰素材
    addDecorations(data) {
        return request({
            url: `/decoration`,
            method: 'post',
            data
        })
    },
    // 单个/批量删除装饰素材
    deleteDecorations(data) {
        return request({
            url: `/decoration`,
            method: 'delete',
            data
        })
    }
};
export default decoration;