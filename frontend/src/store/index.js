import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("user-token"),
    refreshToken: localStorage.getItem("user-refresh-token"),
    userId: Number(localStorage.getItem("user-id")),
    isAdmin: localStorage.getItem("is-admin") === "true",
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
    AUTH_SUCCESS(state, token, refreshToken, userId, isAdmin){
      state.token = token;
      state.refreshToken = refreshToken;
      state.userId = userId;
      state.isAdmin = isAdmin;
    },
    AUTH_REFRESH(state, accessToken, refreshToken){
      state.token = accessToken;
      state.refreshToken = refreshToken;
    }
  },
  actions: {
    authLogout: (context) => {
      localStorage.removeItem("user-id"); // Suppression de l'userID dans le stockage
      localStorage.removeItem("user-token") // Suppression du token dans le stockage
      localStorage.removeItem("is-admin") // Suppression da permission administrateur dans le stockage
      localStorage.removeItem("user-refresh-token");
      context.commit('AUTH_SUCCESS', null, null);
    },
    authLogin: ({commit}, user) => {
      localStorage.setItem("user-id", user.userId);
      localStorage.setItem("user-token", user.token);
      localStorage.setItem("user-refresh-token", user.refreshToken);
      localStorage.setItem("is-admin", user.isAdmin);
      commit('AUTH_SUCCESS', user.token, user.refreshToken, user.userId);
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
