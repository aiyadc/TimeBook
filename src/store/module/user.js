export default {
    state: {
        uid: 2,
    },
    getters: {

    },
    mutations: {
        SET_UID(state, val) {
            state.uid = val
        },
        CLEAR_UID(state) {
            state.uid = null
        }
    },
    actions: {

    }
}