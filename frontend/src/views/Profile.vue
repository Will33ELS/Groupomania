<template>
  <div class="container">
    <div class="row my-4 justify-content-center">
      <img class="profile-img" :src="profile.img == null ? '/images/avatar-defaut.png' : profile.img" alt="Author"/>
      <h1 class="h3 my-2">Profile de {{ profile.name }} </h1>
      <div v-if="this.$store.state.isAdmin && profile.isAdmin" class="col-12">
        <button class="btn bg-danger" data-bs-toggle="modal" data-bs-target="#revoquer">
          Révoquer administrateur
        </button>
        <!-- Modal -->
        <div class="modal fade" id="revoquer" tabindex="-1" aria-labelledby="revoquerLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="revoquerLabel">Révoquer la permission administrateur</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Souhaitez-vous révoquer la permission d'administrateur à cet utilisateur ?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="revoqueAdmin($route.params.id)">Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="profile.isAdmin" class="col-12">
        <span class="badge bg-danger">Administrateur</span>
      </div>
      <div v-else-if="this.$store.state.isAdmin" class="col-12">
        <button class="btn bg-warning" data-bs-toggle="modal" data-bs-target="#setadmin">
          Passer administrateur
        </button>
        <!-- Modal -->
        <div class="modal fade" id="setadmin" tabindex="-1" aria-labelledby="setadminLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="setadminLabel">Attributer la permission administrateur</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Souhaitez-vous attribuer la permission d'administrateur à cet utilisateur ?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="giveAdmin($route.params.id)">Confirmer</button>
              </div>
            </div>
          </div>
        </div>
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
  methods:{
    revoqueAdmin: function(user_id) {
      axios.put(`profile/${user_id}/revoqueAdmin`)
          .then(response => {
            this.$store.dispatch("sendSuccess", response.data.message);
            this.profile.isAdmin = false;
          }).catch(error => {
        this.$store.dispatch("sendError", error.response.data)
      });
    },
    giveAdmin: function(user_id) {
      axios.put(`profile/${user_id}/giveAdmin`)
          .then(response => {
            this.$store.dispatch("sendSuccess", response.data.message);
            this.profile.isAdmin = true;
          }).catch(error => {
        this.$store.dispatch("sendError", error.response.data)
      });
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
    }).catch(error => this.$store.dispatch("sendError", error.response.data));
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
