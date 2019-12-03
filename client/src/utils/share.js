import { ajax } from '@/utils/axios';
const axios = ajax();
class Share {
    constructor (options) {
        const defaultOptions = {
            url: location.href,
            title: '',
            imgUrl: '',
            desc: ''
        };
        this.options = Object.assign(defaultOptions, options);
        this.initShare();
    }
    initShare () {
        const shareScript = document.createElement('script');
        shareScript.src = 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js';
        const lc = document.body.lastChild;
        document.body.insertBefore(shareScript, lc);
        shareScript.onload = () => {
            const url = location.origin.indexOf('apptec') !== -1 ? '/wechat/getsignature' : '/wechatweb/getsignatureweb'; // 官网接口 '/wechatweb/getsignatureweb';
            axios.get(url, {
                params: {
                    url: location.href
                }
            }).then(({ data }) => {
                const { appId, timestamp, nonceStr, signature } = data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId, // 必填，公众号的唯一标识
                    timestamp, // 必填，生成签名的时间戳
                    nonceStr, // 必填，生成签名的随机串
                    signature, // 必填，签名
                    jsApiList: [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ]
                });
                wx.ready(() => {
                    this.shareConfig();
                });
            });
        };
    }
    shareConfig (opts) {
        let { options } = this;
        if (opts) {
            options = Object.assign(options, opts);
        }
        const { url, ...rest } = options;
        const config = {
            link: url,
            ...rest,
            success () {
                console.log('share success');
            },
            cancel () {
                console.log('share fail');
            }
        };
        wx.onMenuShareTimeline(config); // 分享到微信朋友圈
        wx.onMenuShareAppMessage(config); // 分享给微信朋友
        wx.onMenuShareQQ(config); // 分享到QQ
        wx.onMenuShareQZone(config); // 分享到QQ空间
        wx.onMenuShareWeibo(config); // 分享到微博
        wx.updateAppMessageShareData(config);
        wx.updateTimelineShareData(config);
        wx.error((res) => {
            // console.log(res.errMsg);
        });
    }
}
export default Share;
