export default {
    // 解析datetime日期
    parseDatetime(date) {
        date = new Date(date);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    },
    // 数字加密
    encrypt(number) {
        const time = new Date().valueOf() + "";
        return time.slice(0, 3) + number * 2 + time.slice(3, 6);
    },
    // 数字解密
    decrypt(str) {
        str = str + "";
        return parseInt(str.replace(/^\d{3}/, "").replace(/\d{3}$/, "")) / 2;
    }
};