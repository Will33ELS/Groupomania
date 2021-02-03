import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//TIMER
  //SI LE TOKEN ARRIVE A EXPIRE
     //REQUETE DE REFRESH

//REFRESH TOKEN EXPIRATION 2min ACCESS TOKEN EXPIRATION 30min RENOUVELLEMENT DU ACCESS/REFRESH TOKEN TOUTES LES 2 MINUTES
