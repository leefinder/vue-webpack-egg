export default {
    setCookie (name, value) {
        const days = 30;
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
    },
    getCookie (name) {
        const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        const arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    delCookie (name) {
        const exp = new Date();
        exp.setTime(exp.getTime() - 1);
        const cval = this.getCookie(name);
        if (cval !== null) {
            document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
        }
    }
};
