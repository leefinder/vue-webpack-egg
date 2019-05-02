import Router from 'vue-router';
import Vue from 'vue';
import home from './home';
Vue.use(Router);
const router = new Router({
    mode: 'history',
    routes: [
        ...home
    ]
});
export default router;
