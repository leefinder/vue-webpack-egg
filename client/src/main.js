// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import MetaInfo from 'vue-meta-info';
import VueLazyload from 'vue-lazyload';
import App from './App';
import router from './router';
import Message from '@/components/message/message';

import '@/static/font/SourceHanSansCN-Regular/SourceHanSansCN-Regular.css';
import '@/static/font/SourceHanSansCN-Light/SourceHanSansCN-Light.css';
Vue.use(Message);
Vue.use(VueLazyload);
Vue.use(MetaInfo);
Vue.use(VueRouter);
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App />',
    // 添加mounted，不然不会执行预编译
    mounted () {
        document.dispatchEvent(new Event('render-event'));
    }
});
