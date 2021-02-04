<template>
  <div class="container">
    <h1>Connexion</h1>
    <form class="my-4 row justify-content-center" @submit="login" method="post">
      <div class="col-10 col-md-8">
        <div class="mb-3">
          <label for="email" class="form-label">Votre adresse mail</label>
          <input type="email" class="form-control" name="email" v-model="email" id="email">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input type="password" class="form-control" name="password" v-model="password" id="password">
        </div>
        <button type="submit" class="btn btn-primary">Connexion</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '../axios/axios';
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null
    }
  },
  methods:{
    login: function (e) {
      if(!this.email || !this.password){
        this.$store.dispatch("sendError", "Tous les champs sont requis.");
      }else{
        axios.post("auth/login", {
          email: this.email,
          password: this.password
        }).then((response) => {
          window.location = "/";
          this.$store.dispatch("authLogin", {
            userId: response.data.userId,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            isAdmin: response.data.isAdmin
          });
          const task = setInterval(() => {
            axios.post("auth/refresh",{
              userId: this.$store.state.userId,
              refreshToken: this.$store.state.refreshToken
            }).then((response) => {
              this.$store.commit("AUTH_REFRESH", response.data.accessToken, response.data.refreshToken);
            }).catch(error => {
              console.log(error)
              clearInterval(task);
              this.$store.dispatch("authLogout");
              window.location = "/";
            }, 1000 * 60 * 2);
          })
          this.$store.dispatch("sendSuccess", "Vous êtes connecté !");
        }).catch(error => {
            this.$store.dispatch("sendError", error.response.data);
        });
      }
      e.preventDefault();
    }
  }
}
</script>

<style scoped>

</style>
