import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        uid: 2,
        plateform: '',
        TStack: [] // 画布复制对象暂存区
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
        },
        SET_UID(state, val){
            state.uid = val
        },
        CLEAR_UID(state){
            state.uid = null
        }
    },
    actions: {

    }
});