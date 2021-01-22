<template>
  <div class="container">
    <h1>Mon profile</h1>
    <div class="my-4 row justify-content-around">
      <div class="col-12 col-md-4">
        <h2 class="my-4">Vos informations</h2>
        <p>Votre nom: <strong>{{ nom }}</strong></p>
        <p>Votre prénom: <strong>{{ prenom }}</strong></p>
        <p>Votre email: <strong>{{ email }}</strong></p>
        <div class="badge bg-danger" v-if="isAdmin">Vous êtes administrateur</div>
      </div>
      <div class="col-12 col-md-4">
        <h2 class="my-4">Changer votre image de profile</h2>
        <img class="my-3 profile-img" :src="avatarURL == null ? 'images/avatar-defaut.png' : avatarURL" alt="Votre photo de profile"/>
        <form @submit="changeAvatar" class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <input type="file" id="avatar" ref="avatar" class="custom-file-input" @change="handleFileUpload" accept="image/png, image/jpeg"/>
            <label class="custom-file-label mb-0" for="avatar">Choisir une image (100x100 px)</label>
          </div>
          <div class="col-12 my-2">
            <button type="submit" class="btn btn-primary">Valider</button>
          </div>
        </form>
      </div>
    </div>
    <div class="my-4 row justify-content-around">
      <div class="col-12 col-md-4">
        <h2 class="my-4">Changer de mot de passe</h2>
        <form @submit="changePassword">
          <div class="mb-3">
            <label for="actualPassword" class="form-label">Votre mot de passe actuel</label>
            <input type="password" class="form-control" v-model="password" id="actualPassword">
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Votre nouveau mot de passe</label>
            <input type="password" class="form-control" v-model="newpassword" id="newPassword">
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmer votre mot de passe</label>
            <input type="password" class="form-control" v-model="confirmpassword" id="confirmPassword">
          </div>
          <button type="submit" class="btn btn-primary">Confirmer</button>
        </form>
      </div>
      <div class="col-12 col-md-4">
        <h2 class="my-4">Supprimer votre compte !</h2>
        <p>Attention, vous vous apprétez à supprimer <strong>définitivement</strong> votre compte. Une fois le compte supprimé, il n'est plus possible de revenir en arrière !</p>
        <form @submit="unregister">
          <div class="mb-3">
            <label for="deleteAccount" class="form-label">Votre mot de passe</label>
            <input type="password" class="form-control" ref="deleteAccount" id="deleteAccount">
          </div>
          <button type="submit" class="btn btn-danger text-uppercase"><i class="fas fa-trash"></i> Supprimer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyProfile",
  data() {
    return {
      avatarURL: null,
      nom: "###",
      prenom: "###",
      email: "###",
      isAdmin: false,
      password: null,
      newpassword: null,
      confirmpassword: null,
      avatarFile: null,
    }
  },
  beforeMount() {
    axios.get("http://localhost:3000/profile")
        .then(response => {
          this.nom = response.data.nom;
          this.prenom = response.data.prenom;
          this.email = response.data.email;
          this.isAdmin = response.data.isAdmin;
          this.avatarURL = response.data.avatarURL;
        })
        .catch(error => {
          this.$store.dispatch("sendError", error.response.data)
        })
  },
  methods:{
    //ENVOIE DE L'AVATAR
    handleFileUpload(){
      this.avatarFile = this.$refs.avatar.files[0];
    },
    //CHANGEMENT DE L'AVATAR
    changeAvatar: function (event){
      event.preventDefault();
      //RECUPERATION DE L'INPUT #AVATAR
      if(!this.avatarFile){ //VERIFICATION SI LE CHAMP IMAGE EST RENSEIGNES
        this.$store.dispatch("sendError", "Vous n'avez envoyé aucune image.");
      }else{
        //DEFINITION DU FORMULAIRE
        var formData = new FormData();
        //AJOUT DE L'IMAGE DANS LE FORMULAIRE
        formData.append("file", this.avatarFile);
        //ENVOIE VERS LE SERVEUR
        axios.post('http://localhost:3000/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          this.avatarURL = response.data.avatarURL;
          this.$store.dispatch("sendSuccess", response.data.message);
        }).catch(error => this.$store.dispatch("sendError", error.response.data));
      }
    },
    //CHANGEMENT DU MOT DE PASSE
    changePassword: function(event) {
      event.preventDefault();
      if(!this.password || !this.newpassword || !this.confirmpassword){ //VERIFICATION SI TOUS LES CHAMPS SONT RENSEIGNES
        this.$store.dispatch("sendError", "Tous les champs sont requis.");
      }else {
        //ENVOIE DE LA REQUETE AU SERVEUR
        axios.post("http://localhost:3000/auth/password", {
          password: this.password,
          newpassword: this.newpassword,
          confirmpassword: this.confirmpassword
        }).then(response => {
          this.$store.dispatch("sendSuccess", response.data.message) //REQUETE REUSSITE
        }).catch(error => {
          this.$store.dispatch("sendError", error.response.data) //REQUETE ECHEC
        });

        //RESET DES INPUTS
        document.getElementById("actualPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      }
    },
    //SUPPRESSION DU COMPTE
    unregister: function (event){
      event.preventDefault();
      if(!this.$refs.deleteAccount.value)
        this.$store.dispatch("sendError", "Tous les champs sont requis.");
      else{
        //ENVOIE DE LA REQUETE AU SERVEUR
        axios.post("http://localhost:3000/auth/unregister", {
          password: this.$refs.deleteAccount.value,
        }).then(response => {
          this.$store.dispatch("sendSuccess", response.data.message) //REQUETE REUSSITE
          this.$store.dispatch("authLogout"); //DECONNEXION DE L'UTILISATEUR
          window.location = "/register"; //REDIRECTION VERS LA PAGE D'INSCRIPTION
        }).catch(error => {
          this.$store.dispatch("sendError", error.response.data) //REQUETE ECHEC
        });
        //RESET DE L'INPUT
        document.getElementById("deleteAccount").value = "";
      }
    }
  }
}
</script>

<style scoped>
.profile-img{
  width: 100px;
  height: 100px;
  border-radius: 50px;
}


</style>
