export default {
  namespaced: true,
  state: {
    keepAliveIncludes: []
  },

  mutations: {
    addKeepAliveComp(state, {name, id}) {
      state.keepAliveIncludes.push({name, id})
    },
    removeKeepAliveComp(state, idx) {
      state.keepAliveIncludes.splice(idx, 1)
    },
  }
}