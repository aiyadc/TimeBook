import request from "@/utils/request";
export default {
    // 获取日访问量
    getDayView(date) {
        return request({
            url: `/system/day?date=${date}`,
            method: 'get'
        })
    },
    // 获取月访问量
    getMonthView() {
        return request({
            url: '/system/month',
            method: 'get'
        })
    }
}