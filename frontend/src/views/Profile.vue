<template>
  <div class="container">
    <div class="row my-4 justify-content-center">
      <img class="profile-img" :src="profile.img == null ? '/images/avatar-defaut.png' : profile.img" alt="Author"/>
      <h1 class="h3 my-2">Profile de {{ profile.name }} </h1>
      <div v-if="profile.isAdmin" class="col-12">
        <span class="badge bg-danger">Administrateur</span>
      </div>
    </div>
    <hr/>
    <h2 class="my-4">Dernières publications</h2>
    <Publication v-for="publication in publications" :key="publication.id" :publication_id="publication.id" :avatar="publication.avatar" :author_id="publication.author_id" :author="publication.author" :content="publication.content" :attachment="publication.attachment" />
  </div>
</template>

<script>
import axios from "../axios/axios";
import Publication from "@/components/Publication";

export default {
  name: "Profile",
  components:{
    Publication
  },
  data(){
    return {
      profile:{
        img: null,
        name: null,
        isAdmin: false,
      },
      publications: []
    }
  },
  beforeCreate() {
    axios.get(`profile/${this.$route.params.id}`).then(response => {
      const data = response.data;
      this.profile.name = data.nom + " " + data.prenom;
      this.profile.img = data.avatarURL;
      this.profile.isAdmin = data.isAdmin;
    }).catch(() => window.location = "/");
    axios.get(`publications/author/${this.$route.params.id}`).then(response => {
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
    }).catch(error => this.$store.dispatch("sendError", error));
  }
}
</script>

<style scoped>
.profile-img{
  padding: 0;
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
</style>
