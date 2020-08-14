import { Component, Vue } from 'vue-property-decorator';
import AppCore from '@/utils/app-core';
import Cookie from '@/utils/cookie.js';

function asyncAppData () {
    return AppCore.LMGetID1();
}
function syncAppPage (url) {
    AppCore.LMPushToURL.call(this, url);
}
function syncAppDropDownRefresh () {
    try {
        AppCore.LPCloseDownRefresh();
    } catch (e) {
        console.log(e);
    }
}
function syncToHistory () {
    AppCore.LMPopWebView.call(this);
}
/**
 * str={
 * isShowBack:1 显示返回键
 * isShowHome:1 显示返回首页按键
 * }
 */
function syncAppPageWithBtn (url, str) {
    AppCore.LMPushToURLShowBtn(url, str);
}
function syncAppShare (jsonStr) {
    AppCore.LMShareURLtoSocialNet(jsonStr);
}
/**
 * 移动端城市定位GPS定位回调
 *
 * currentLongitude  经度  currentLatitude  纬度
 */
function asyncAppLocation () {
    return AppCore.LPCityOrientation();
}
function syncAppLoginPage () {
    AppCore.LMGetID2();
}
function syncAppVersion () {
    return AppCore.getLpAppVersionData();
}
function lpRouterTo (pathMap, options) {
    const { platform } = this;
    let { query, isNative, event } = options;
    let path = `${pathMap[platform]}?platform=${platform}`;
    if (query) {
        path += `&${query}`;
    }
    switch (platform) {
    case 'app':
        this.syncAppPage(encodeURI(path));
        break;
    case 'miniApp':
        if (isNative) {
            if (event === 'reLaunch' && pathMap[platform] === '/pages/index/index') {
                this.$message.info('功能维护中，您可在官网、APP中预定下单', 2000);
                return;
            }
            event = event || 'navigateTo';
            typeof wx === 'object' && wx.miniProgram[event]({
                url: path
            });
        } else {
            location.href = path;
        }
        break;
    default:
        this.$router.push({
            path
        });
        break;
    }
}
function pageOnLoad (useCookie = false) {
    const loginState = Cookie.getCookie('lp_loginState');
    const phone = Cookie.getCookie('lp_phone');
    const delegationToken = Cookie.getCookie('lp_delegationToken');
    if (loginState && phone && delegationToken && useCookie) {
        return Promise.resolve({
            loginState,
            phone,
            delegationToken
        });
    } else {
        return asyncAppData().then(({ LMPhoneNum, LMAccID, delegationToken }) => {
            Cookie.setCookie('lp_delegationToken', delegationToken);
            Cookie.setCookie('lp_phone', LMPhoneNum);
            Cookie.setCookie('lp_loginState', LMAccID);
            return {
                loginState: LMAccID,
                phone: LMPhoneNum,
                delegationToken
            };
        });
    }
}
export const BridgeMixin = {
    methods: {
        pageOnLoad,
        asyncAppData,
        syncAppPage,
        syncToHistory,
        syncAppPageWithBtn,
        syncAppShare,
        asyncAppLocation,
        syncAppLoginPage,
        syncAppDropDownRefresh,
        syncAppVersion,
        lpRouterTo
    }
};

@Component
export class MixinsTs extends Vue {
    asyncAppData () {
        return asyncAppData();
    }

    pageOnLoad (useCookie = false) {
        return pageOnLoad(useCookie);
    }

    syncAppPage () {
        const args = Array.prototype.slice.call(arguments);
        return syncAppPage.call(this, ...args);
    }

    syncToHistory () {
        return syncToHistory.call(this);
    }

    syncAppPageWithBtn () {
        const args = Array.prototype.slice.call(arguments);
        return syncAppPageWithBtn(...args);
    }

    syncAppShare () {
        const args = Array.prototype.slice.call(arguments);
        return syncAppShare(...args);
    }

    asyncAppLocation () {
        return asyncAppLocation();
    }

    syncAppDropDownRefresh () {
        return syncAppDropDownRefresh();
    }

    syncAppLoginPage () {
        return syncAppLoginPage();
    }

    syncAppVersion () {
        return syncAppVersion();
    }

    lpRouterTo () {
        return lpRouterTo();
    }
};
