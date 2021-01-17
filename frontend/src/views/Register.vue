<template>
  <div>
    <h1>Inscription</h1>
    <form @submit="signup" class="my-4 row justify-content-center" method="post">
      <div class="col-10 col-md-8">
        <div class="mb-3 row">
          <div class="col">
            <label for="nom" class="form-label">Votre nom</label>
            <input type="text" class="form-control" name="nom" v-model="nom" id="nom">
          </div>
          <div class="col">
            <label for="prenom" class="form-label">Votre prenom</label>
            <input type="text" class="form-control" name="prenom" v-model="prenom" id="prenom">
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Votre adresse mail</label>
          <input type="email" class="form-control" name="email" v-model="email" id="email">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input type="password" class="form-control" name="password" v-model="password" id="password">
        </div>
        <button type="submit" class="btn btn-primary">S'inscrire</button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      nom: null,
      prenom: null,
      email: null,
      password: null
    }
  },
  methods:{
    signup: function (event) {
      if(!this.nom || !this.prenom || !this.email || !this.password){
        this.$store.dispatch("sendError", "Tous les champs sont requis.");
      }else{
        axios.post("http://localhost:3000/auth/register", {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
        }).then(() => {
          this.$store.dispatch("sendSuccess", "Votre compte a bien été crée !");
          this.$router.push("/login");
        }).catch(error => {
          this.$store.dispatch("sendError",  error.response.data);
        });
      }
      event.preventDefault();
    }
  }
}
</script>

<style scoped>

</style>
