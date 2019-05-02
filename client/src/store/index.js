import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import Vue from 'vue';
Vue.use(Vuex);
const store = new Vuex.Store({
    state,
    mutations,
    actions
});
export default store;
