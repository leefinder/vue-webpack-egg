function pxToRem () {
    var dpr;
    var rem;
    // let scale;
    var docEl = document.documentElement;
    // const metaEl = document.querySelector('meta[name="viewport"]');
    dpr = window.devicePixelRatio || 1;
    var w = docEl.getBoundingClientRect().width;
    rem = 100 * (w / 375);
    // scale = 1 / dpr;
    // 设置viewport，进行缩放，达到高清效果
    // metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
    // 设置data-dpr属性，留作的css hack之用，解决图片模糊问题和1px细线问题
    docEl.setAttribute('data-dpr', dpr);
    // 动态写入样式
    docEl.setAttribute('style', 'font-size:' + rem + 'px');
}
pxToRem();
var timer = null;
window.addEventListener('resize', function () {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        pxToRem();
        document.body.setAttribute('style', 'visibility:visible');
        timer = null;
    }, 50);
});
