import request from "@/utils/request";
const favorRequest = {
    // 获取收藏列表
    getFavorList(uid) {
        return request({
            url: `/favor/${uid}`,
            method: "get"
        });
    },
    // 添加/删除收藏
    handleFavor(uid, isfavor, aid) {
        return request({
            url: `/favor/${uid}`,
            method: "patch",
            params: { isfavor, aid }
        });
    },
};

export default favorRequest