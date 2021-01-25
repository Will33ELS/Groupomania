import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("user-token"),
    userId: Number(localStorage.getItem("user-id")),
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
    AUTH_SUCCESS(state, token, userId){
      state.token = token
      state.userId = userId
    },
  },
  actions: {
    authLogout: (context) => {
      localStorage.removeItem("user-id"); // Suppression de l'userID dans le stockage
      localStorage.removeItem("user-token") // Suppression du token dans le stockage
      context.commit('AUTH_SUCCESS', null, null);
    },
    authLogin: ({commit}, user) => {
      localStorage.setItem("user-id", user.userId);
      localStorage.setItem("user-token", user.token);
      commit('AUTH_SUCCESS', user.token, user.userId);
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
