import request from "@/utils/request";
const favorRequest = {
    // 获取收藏列表
    getFavorList(uid) {
        return request({
            url: `/favor?uid=${uid}`,
            method: "get"
        });
    },
    // 添加收藏
    addFavor(uid, aid) {
        return request({
            url: `/favor?uid=${uid}`,
            method: "patch",
            data: { aid }
        });
    },
    // 取消收藏
    deleteFavor(uid, aid) {
        return request({
            url: `/favor?uid=${uid}`,
            method: "patch",
            data: { aid }
        });
    }
};

export default favorRequest