<template>
  <nav id="nav">
    <div class="row">
      <div class="col text-center">
        <a href="/">
          <img src="images/banniere.png" alt="Bannière groupomania"/>
        </a>
      </div>
    </div>
    <div class="row justify-content-center">
      <!-- Utilisateur non connecté -->
      <div class="col text-center" v-if="$store.state.token == null">
        <div class="nav-item d-inline">
          <router-link to="/login">Connexion</router-link>
        </div>
        <div class="nav-item d-inline">
          <router-link to="/register">Inscription</router-link>
        </div>
      </div>
      <!-- Utilisateur connecté -->
      <div class="col text-center" v-if="$store.state.token != null">
        <div class="nav-item d-inline">
          <router-link to="/login">Mon profil</router-link>
        </div>
        <div class="nav-item d-inline">
          <a href="#" @click="logout">Déconnexion</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    logout: function (event) {
      this.$store.dispatch("authLogout");
      this.$router.push("/login");
      event.preventDefault();
    }
  }
}
</script>

<style scoped>

#nav{
  padding: 12px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

img{
  height: 50px;
  width: auto;
  margin: 10px;
}

.nav-item{
  margin: 10px;
}
</style>
