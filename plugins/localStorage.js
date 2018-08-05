// import createPersistedState from 'vuex-persistedstate/dist/ssr.js'
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({

      key: 'vuex'
  
  })(store)
}