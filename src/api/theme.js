import request from "@/utils/request";
const theme = {
    // 获取主题
    getThemeList(tid) {
        return request({
            url: '/theme',
            method: 'get',
        })
    },
    // 增加主题
    addTheme(data) {
        return request({
            url: '/theme',
            method: 'post',
            data
        })
    },
    // 修改主题名称  
    updateTheme(data, tid) {
        return request({
            url: `/theme?tid=${tid}`,
            method: 'patch',
            data
        })
    },
    // 删除主题
    deleteTheme(tid) {
        return request({
            url: `/theme?tid=${tid}`,
            method: 'delete',
        })
    }
};
export default theme