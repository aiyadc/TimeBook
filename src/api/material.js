import request from "@/utils/request";

const material = {
    // 获取用户素材目录
    getFolders(uid){
        return request({
            url: `/material-list/${uid}`,
            method:'get',
        })
    },
    // 获取我的装饰屋
    // 获取我上传的图片（按mlid分类）
    getMaterials(mlid){
        return request({
            url: `/material`,
            method: 'get',
            params:{mlid}
        })
    },
    // 添加上传照片
    uploadMore: function(data,uid) {
            return request({
                url: `/material/${uid}`,
                method: "post",
                data
            });
        }
        // 删除上传的照片
};
export default material