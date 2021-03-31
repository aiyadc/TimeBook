import request from "@/utils/request";
const decoration = {
    // 获取装饰目录
    getFolders(){
        return request({
            url:'/decoration-list',
            method:'get',
        })
    },
    // 获取装饰目录中的图片
    getDecorations(dlid){
        return request({
            url:`/decoration?dlid=${dlid}`,
            method:'get'
        })
    }
  }
export default decoration