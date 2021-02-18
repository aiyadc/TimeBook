import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        plateform: ''
    },
    mutations: {
        SET_PLATEFORM(state, val) {
            state.plateform = val
        }
    },
    actions: {

    }
});