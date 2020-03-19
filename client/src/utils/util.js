export default {
    getParameter (name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let href = location.href;
        const regx = /(\?from=[a-z]+)(&isappinstalled=[0-9]{1}){0,1}/g;
        if (regx.test(href)) {
            href = href.replace(regx, '');
        }
        const r = href.substr(href.indexOf('?') + 1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },
    parseQueryString () {
        let href = location.href;
        const regx = /(\?from=[a-z]+)(&isappinstalled=[0-9]{1}){0,1}/g;
        if (regx.test(href)) {
            href = href.replace(regx, '');
        }
        const regUrl = /^[^?]+\?([\w\W]+)$/;
        const regPara = /([^&=]+)=([\w\W]*?)(&|$)/g;
        const arrUrl = regUrl.exec(href);
        const ret = {};
        if (arrUrl && arrUrl[1]) {
            const strPara = arrUrl[1];
            let result;
            while ((result = regPara.exec(strPara)) !== null) {
                ret[result[1]] = decodeURI(result[2]);
            }
        }
        return ret;
    }
}