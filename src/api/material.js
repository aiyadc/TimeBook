import request from "@/utils/request";

const material = {
    // 获取我的装饰屋
    // 获取我上传的图片（按日期分类）
    // 添加上传照片
    uploadMore: function(data) {
            return request({
                url: "/material",
                method: "post",
                data
            });
        }
        // 删除上传的照片
};
export default material