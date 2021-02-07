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
      <Publication v-for="publication in publications" :key="publication.id" :publication_id="publication.id" :avatar="publication.avatar" :author_id="publication.author_id" :author="publication.author" :content="publication.content" :attachment="publication.attachment"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
// @ is an alias to /src

import Publication from "@/components/Publication";
import axios from "../axios/axios";

export default {
  name: 'Home',
  data(){
    return {
      postFile: null,
      publications: [],
    }
  },
  components: {
    Publication
  },
  beforeCreate() {
    axios.get("publications/").then(response => {
      const data = response.data;
      data.forEach(publication => {
        this.publications.push({
          "id": publication.publication_id,
          "avatar": publication.avatar,
          "author": publication.nom + " " + publication.prenom,
          "author_id": publication.author_id,
          "content": publication.content,
          "attachment": publication.attachement
        });
      })
    });
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
        axios.post('publications/create', formData).then(() => {
          window.location = '/';
        }).catch(error => this.$store.dispatch("sendError", error.response.data));
      }
    }
  }
}
</script>
