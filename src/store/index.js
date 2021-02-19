import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        plateform: '',
        TStack: [] // 暂存区
    },
    mutations: {
        SET_PLATEFORM(state, val) {
            state.plateform = val
        },
        Push_TStack(stack, obj) {
            stack.TStack = []
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                stack.TStack.push(obj)
            } else {
                stack.TStack.push(...obj)
            }
        },
        Pop_TStack(stack) {
            stack.TStack = []
        }

    },
    actions: {

    }
});