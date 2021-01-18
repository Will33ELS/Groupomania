import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || null,
    error: null,
    success: null,
  },
  mutations: {
    CHANGE_ERROR(state, error){
      state.error = error;
    },
    CHANGE_SUCCESS(state, success){
      state.success = success;
    },
  },
  actions: {
    authLogout: () => {
      localStorage.removeItem("user-token") // clear your user's token from localstorage
    },
    authLogin: (context, token) => {
      localStorage.setItem("user-token", token);
    },
    sendError: (context, error) => {
      context.commit("CHANGE_ERROR", error);
      context.commit("CHANGE_SUCCESS", null);
    },
    sendSuccess: (context, success) => {
      context.commit("CHANGE_SUCCESS", success);
      context.commit("CHANGE_ERROR", null);
    },
    dismissAlert: (context, type) => {
      if(type === "danger")
        context.commit("CHANGE_ERROR", null);
      if(type === "success")
        context.commit("CHANGE_SUCCESS", null);
    }
  },
  modules: {
  }
})
