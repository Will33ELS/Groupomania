<template>
  <div>
    <div class="container">
      <form class="m-3" @submit="createPost">
        <h2 class="mb-4">Publier du contenu</h2>
        <div class="form-floating">
          <textarea class="form-control" id="publication" ref="postContent" style="height: 100px"></textarea>
          <label for="publication">Que voulez-vous raconter ?</label>
        </div>
        <div class="row justify-content-start my-3">
          <div class="col input-group">
            <input type="file" class="form-control" id="file" ref="postFile" @change="handleFileUpload" aria-label="Sélectionner une image">
            <button class="btn btn-primary" type="submit">Publier</button>
          </div>
        </div>
      </form>
    </div>
    <div class="container my-5">
      <h2 class="mb-4">Votre fil d'actualité</h2>
    </div>
  </div>
</template>

<style>
</style>

<script>
// @ is an alias to /src

import axios from "axios";

export default {
  name: 'Home',
  data(){
    return {
      postFile: null
    }
  },
  components: {
  },
  methods:{
    handleFileUpload(){
      this.postFile = this.$refs.postFile.files[0];
    },
    createPost: function (event) {
      event.preventDefault();
      if (this.$refs.postContent.value.length === 0) {
        this.$store.dispatch("sendError", "Vous ne pouvez pas poster un contenu vide.");
      } else {
        //DEFINITION DU FORMULAIRE
        var formData = new FormData();
        //AJOUT DE L'IMAGE DANS LE FORMULAIRE
        formData.append("message", this.$refs.postContent.value);
        formData.append("file", this.postFile);
        //ENVOIE VERS LE SERVEUR
        axios.post('http://localhost:3000/publications/create', formData).then(response => {
          this.$store.dispatch("sendSuccess", response.data.message);
        }).catch(error => this.$store.dispatch("sendError", error.response.data));
      }
    }
  }
}
</script>
