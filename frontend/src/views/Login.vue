<template>
  <div>
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
import axios from 'axios';
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
        const vm = this;
        axios.post("http://localhost:3000/auth/login", {
          email: this.email,
          password: this.password
        }).then((response) => {
          window.location = "/";
          this.$store.dispatch("authLogin", response.data.token);
          this.$store.dispatch("sendSuccess", "Vous êtes connecté !");
          vm.$forceUpdate();
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
