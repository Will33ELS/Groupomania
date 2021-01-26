<template>
  <div>
    <!-- CARTE PUBLICATION -->
    <div class="container">
      <div class="my-5 row justify-content-center">
        <div class="publication col-10">
          <div class="publication-header">
            <div class="author">
              <a href="#" class="d-inline-flex align-items-center">
                <img class="author-avatar" :src="this.author.avatar == null ? '/images/avatar-defaut.png' : this.author.avatar" alt="Author"/>
                <div class="author-name">
                  {{ this.author.name }}
                </div>
              </a>
            </div>
            <div v-if="this.author.id == this.$store.state.userId || this.$store.state.isAdmin" class="tool">
              <div class="dropdown">
                <a href="#" role="button" id="publicationSettings" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-h"></i>
                </a>
                <ul class="dropdown-menu" aria-labelledby="publicationSettings">
                  <li><a class="dropdown-item" href="#">Supprimer</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="publication-body">
            <div class="publication-body-content text-start">
              {{ publication.content }}
            </div>
            <img v-if="publication.attachment != null" class="publication-body-img" :src="publication.attachment"/>
          </div>
          <hr/>
          <div class="publication-footer d-inline-flex">
            <div class="publication-footer-item mx-3">
              <a :id="'like-button-'+this.publication.id" href="#">
                <i class="fas fa-heart"></i> J'aime ({{ this.publication.likes.length }})
              </a>
            </div>
            <div class="publication-footer-item mx-3">
              <a href="#commentaire">
                <i class="fas fa-comment"></i> Commentaire{{ this.publication.commentaires.length > 1 ? "s" : "" }} ({{ this.publication.commentaires.length}})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FIN CARTE PUBLICATION -->
    <!-- CARTE COMMENTAIRES -->
    <div class="container mt-3" id="commentaire">
      <h2>Commentaires</h2>
      <form @submit="addCommentaire">
        <div class="input-group">
          <span class="input-group-text">Commenter</span>
          <textarea class="form-control" ref="commentaire" aria-label="Votre commentaire"></textarea>
          <button type="submit" class="btn btn-primary">Valider</button>
        </div>
      </form>
      <hr class="my-4"/>
      <!-- Alerte d'information s'il n'y a aucun commentaire sur cette publication -->
      <div class="row justify-content-center" v-if="publication.commentaires.length == 0">
        <div class="col-6 alert alert-info" role="alert">
          <i class="fas fa-comment-slash"></i> Il n'y a aucun commentaire sur cette publication
        </div>
      </div>
      <!-- Fin d'alerte -->
      <div v-for="commentaire in publication.commentaires" :key="commentaire.id" v-else class="row p-3 m-3 commentaire">
        <div class="col-12 col-md-3 text-center">
          <img :src="commentaire.authorAvatar == null ? '/images/avatar-defaut.png' : commentaire.authorAvatar" :alt="commentaire.authorName" class="commentaire-avatar"/>
          <div class="text-truncate mt-2">{{ commentaire.authorName }}</div>
        </div>
        <div class="col-12 col-md-9 justify-content-center justify-content-md-start text-center text-md-start">
          <div class="col-12 my-1">Posté le {{ commentaire.date}}</div>
          <div class="col-12 text-break my-2">{{ commentaire.commentaire }}</div>
          <div class="col-12 my-3">
            <a href="#commentaire" v-if="commentaire.authorId != $store.state.userId" class="btn btn-warning mx-1 button">
              <i class="fas fa-exclamation-triangle"></i>
              Signaler
            </a>
            <a href="#commentaire" @click="deleteCommentaire(commentaire.id)" v-if="commentaire.authorId == $store.state.userId || $store.state.isAdmin" class="btn btn-danger mx-1 button">
              <i class="fas fa-trash"></i>
              Supprimer
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- FIN CARTE COMMENTAIRES -->
  </div>
</template>

<script>
import axios from "../axios/axios";

export default {
  name: "Publication",
  data(){
    return {
      publication: {
        id: this.$route.params.id,
        content: null,
        attachment: null,
        likes: [],
        commentaires: []
      },
      author: {
        id: 0,
        name: null,
        avatar: null
      },
    }
  },
  beforeCreate() {
    //RECUPERATION DES DONNEES DE LA PUBLICATION
    axios.get(`http://localhost:3000/publications/${this.$route.params.id}`)
        .then(response => {
          const data = response.data;
          this.publication.content = data.content;
          this.publication.attachment = data.attachement;
          this.author.id = data.author_id;
          this.author.name = data.nom + " " + data.prenom;
          this.author.avatar = data.avatar;
        }).catch(() => window.location = "/" );

    //CHARGEMENT DES LIKES DE LA PUBLICATION
    axios.get(`http://localhost:3000/publications/${this.$route.params.id}/like`).then(response => {
      const data = response.data;
      data.forEach(like => {
        this.publication.likes.push(like.user_id);
      });
      if(this.publication.likes.includes(this.$store.state.userId)){
        document.getElementById("like-button-"+this.publication.id).classList.add("active");
      }
    }).catch(error => this.$store.dispatch("sendError", error));
    //RECUPERATION DES COMMENTAIRES DE LA PUBLICATION
    axios.get(`http://localhost:3000/publications/${this.$route.params.id}/commentaires`)
        .then(response => {
          const data = response.data;
          data.forEach(commentaire => {
            this.publication.commentaires.push({
              id: commentaire.commentaire_id,
              authorId: commentaire.author_id,
              authorName: commentaire.nom + " " + commentaire.prenom,
              authorAvatar: commentaire.avatar,
              commentaire: commentaire.content,
              date: commentaire.date
            })
          })
        }).catch(error => this.$store.dispatch("sendError", error.response.data));
  },
  methods:{
    deleteCommentaire: function (commentaire_id){
      axios.delete(`http://localhost:3000/commentaire/${commentaire_id}`)
      .then(response => {
        this.publication.commentaires = this.publication.commentaires.filter(commentaire => commentaire_id !== commentaire.id);
        this.$store.dispatch("sendSuccess", response.data.message);
      })
      .catch(error => this.$store.dispatch("sendError", error.response.data));
    },
    addCommentaire: function (e){
      e.preventDefault();
      if(!this.$refs.commentaire.value)
      {
        this.$store.dispatch("sendError", "Votre commentaire doit avoir un contenu.")
      }else {
        axios.post("http://localhost:3000/commentaire/add", {
          publicationId: this.publication.id,
          userId: this.$store.state.userId,
          content: this.$refs.commentaire.value
        })
        .then(() => { window.location.reload(); })
        .catch(error => this.$store.dispatch("sendError", error.response.data))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .commentaire{
    border: 1px lightgray solid;
    box-shadow: 4px 4px 5px lightgray;
    font-size: 18px;
    &-avatar{
      width: 100px;
      height: 100px;
      border-radius: 50px;
    }
  }
</style>
