const isProd = process.env.NODE_ENV === 'production';
const useMock = process.env.NODE_ENV === 'development';
const bridge = {
    LPCloseDownRefresh: () => window.AndroidWebView ? window.AndroidWebView.LPCloseDownRefresh() : LPCloseDownRefresh(),
    LMGetID1: () => new Promise((resolve, reject) => {
        let r;
        const client = isProd ? 'd9bc3ebda50f4132a6937dfdf8707a02' : '39b342e06405439c8d921b0b15a31980';
        if (window.AndroidWebView) {
            r = window.AndroidWebView.LMGetID1(client);
            r = typeof r === 'string' ? JSON.parse(r) : r;
            resolve(r);
        } else {
            let count = 0;
            const timer = setInterval(function () {
                count++;
                if (count > 12) {
                    clearInterval(timer);
                    reject(count);
                }
                if (!!LMGetID1 && typeof LMGetID1 === 'function') {
                    r = LMGetID1(client) || {};
                    clearInterval(timer);
                    r = typeof r === 'string' ? JSON.parse(r) : r;
                    resolve(r);
                }
            }, 500);
        }
    }),
    LMPushToURL: (...args) => window.AndroidWebView ? window.AndroidWebView.LMPushToURL(...args) : LMPushToURL(...args),
    LMPopWebView: (...args) => window.AndroidWebView ? window.AndroidWebView.LMPopWebView(...args) : LMPopWebView(...args),
    LMPushToURLShowBtn: (...args) => window.AndroidWebView ? window.AndroidWebView.LMPushToURLShowBtn(...args) : LMPushToURLShowBtn(...args),
    LMShareURLtoSocialNet: (...args) => window.AndroidWebView ? window.AndroidWebView.LMShareURLtoSocialNet(...args) : LMShareURLtoSocialNet(...args),
    LPCityOrientation: () => new Promise((resolve, reject) => {
        let r;
        if (window.AndroidWebView) {
            r = window.AndroidWebView.LPCityOrientation();
            r = typeof r === 'string' ? JSON.parse(r) : r;
            resolve(r);
        } else {
            let count = 0;
            const timer = setInterval(function () {
                count++;
                if (count > 12) {
                    clearInterval(timer);
                    reject(count);
                }
                if (!!LPCityOrientation && typeof LPCityOrientation === 'function') {
                    r = LPCityOrientation() || {};
                    clearInterval(timer);
                    r = typeof r === 'string' ? JSON.parse(r) : r;
                    resolve(r);
                }
            }, 500);
        }
    }),
    LMGetID2: (...args) => window.AndroidWebView ? window.AndroidWebView.LMGetID2(...args) : LMGetID2(...args),
    getLpAppVersionData: () => {
        let r;
        if (window.AndroidWebView) {
            r = window.AndroidWebView.getLpAppVersionData();
        } else {
            r = getLpAppVersionData();
        }
        r = typeof r === 'string' ? JSON.parse(r) : r;
        return r;
    }
};

const analogBridge = {
    // 16250563423375360 18667105710
    // 1807601000169577 17376557103
    LPCloseDownRefresh: () => console.log('禁止下拉刷新调用成功'),
    LMGetID1: () => Promise.resolve({
        LMPhoneNum: '18667105710',
        LMAccID: '1807601000169577',
        delegationToken: 'c2efd756-2356-4ccd-b45e-a4643920970d'
    }),
    LMPushToURL (path) {
        /^([a-z][a-z\d+\-\\.]*:)?\/\//i.test(path) ? location.href = path
            : this.$router.push({
                path
            });
    },
    LMPopWebView () {
        this.$router.back();
    },
    LMPushToURLShowBtn: () => {},
    LMShareURLtoSocialNet: () => console.log('分享调用成功'),
    LPCityOrientation: () => Promise.resolve({
        currentLongitude: '120.223901',
        currentLatitude: '30.209219',
        locationProvince: '',
        locationCity: '',
        locationProvinceCode: '',
        locationCityCode: ''
    }),
    LMGetID2: () => console.log('唤起APP登录弹窗'),
    getLpAppVersionData: () => ({
        versionName: '11523'
    })
};

const mobileCode = useMock ? analogBridge : bridge;

export default mobileCode;
