<template>
  <div class="my-5 row justify-content-center">
    <div class="publication col-10">
      <div class="publication-header">
        <div class="author">
          <router-link :to="'/profile/'+this.author_id" class="d-inline-flex align-items-center">
            <img class="author-avatar" :src="avatar == null ? '/images/avatar-defaut.png' : avatar" alt="Author"/>
            <div class="author-name">
              {{ author }}
            </div>
          </router-link>
        </div>
        <div v-if="this.author_id == this.$store.state.userId || this.$store.state.isAdmin" class="tool">
          <div class="dropdown">
            <a href="#" role="button" id="publicationSettings" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-ellipsis-h"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="publicationSettings">
              <li><a class="dropdown-item" @click="deletePublication" href="#">Supprimer</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="publication-body">
        <div class="publication-body-content text-start">
          {{ content }}
        </div>
        <img v-if="attachment != null" class="publication-body-img" :src="attachment"/>
      </div>
      <hr/>
      <div class="publication-footer d-inline-flex">
        <div class="publication-footer-item mx-3">
          <a :id="'like-button-'+id" @click="likePost" href="#">
            <i class="fas fa-heart"></i> J'aime ({{ this.likes.length }})
          </a>
        </div>
        <div class="publication-footer-item mx-3">
          <a href="#" @click="loadingCommentaire" data-bs-toggle="modal" :data-bs-target="'#commentaires-'+this.id">
            <i class="fas fa-comment"></i> Commenter ({{ this.commentaireNumber }})
          </a>
        </div>
      </div>
    </div>
    <!-- Modal permettant d'afficher les commentaires -->
    <div class="modal fade" :id="'commentaires-'+this.id" tabindex="-1" :aria-labelledby="'commentairesLabel-'+this.id" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'commentairesLabel-'+this.id">Commentaires</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Formulaire pour poster un commentaire -->
            <form class="mb-4" @submit="addCommentaire">
              <div class="input-group">
                <span class="input-group-text">Commenter</span>
                <textarea class="form-control" ref="commentaire" aria-label="Votre commentaire"></textarea>
                <button type="submit" class="btn btn-primary">Valider</button>
              </div>
            </form>
            <!-- Fin du formulaire -->
            <!-- Animation de chargement -->
            <div :id="'commentaires-loading-'+this.id">
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Chargement des commentaires...</p>
            </div>
            <!-- Fin de l'animation -->
            <!-- Message d'information -->
            <div class="row justify-content-center" v-if="commentaires.length == 0">
              <div class="alert alert-info" role="alert">
                <i class="fas fa-comment-slash"></i> Il n'y a aucun commentaire sur cette publication
              </div>
            </div>
            <!-- Fin du message -->
            <!-- Liste des commentaires -->
            <div v-for="commentaire in commentaires" :id="'commentaire-'+commentaire.id" :key="commentaire.id" v-else class="row p-3 m-3 commentaire">
              <div class="col-12 col-md-3 text-center">
                <router-link class="commentaire-link" :to="'/profile/'+commentaire.authorId">
                  <img :src="commentaire.authorAvatar == null ? '/images/avatar-defaut.png' : commentaire.authorAvatar" :alt="commentaire.authorName" class="commentaire-avatar"/>
                  <div class="text-truncate mt-2">{{ commentaire.authorName }}</div>
                </router-link>
              </div>
              <div class="col-12 col-md-9 justify-content-center justify-content-md-start text-center text-md-start">
                <div class="col-12 my-1">Posté le {{ commentaire.date}}</div>
                <div class="col-12 text-break my-2">{{ commentaire.commentaire }}</div>
                <div class="col-12 my-3">
                  <a href="#" @click="deleteCommentaire($event, commentaire.id)" v-if="commentaire.authorId === $store.state.userId || $store.state.isAdmin" class="btn btn-danger mx-1 button">
                    <i class="fas fa-trash"></i>
                    Supprimer
                  </a>
                </div>
              </div>
            </div>
            <!-- Fin de la liste de commentaires -->
          </div>
        </div>
      </div>
    </div>
    <!-- Fin du modal -->
  </div>
</template>

<script>
import axios from "../axios/axios";

export default {
  name: "Publication",
  data(){
    return{
      likes: [],
      commentaireNumber: 0,
      id: this.publication_id,
      commentaires:[]
    }
  },
  props:{
    publication_id:{
      type: Number,
      required: true,
    },
    avatar:{
      type: String,
      default: "/images/avatar-defaut.png",
    },
    author_id:{
      type: Number,
      required: true
    },
    author:{
      type: String,
      required: true
    },
    content:{
      type: String,
      required: true
    },
    attachment:{
      type: String,
    }
  },
  methods:{
    //INTERACTION SUR LE BOUTON LIKE, LE SERVEUR BACKEND GERE SI L'UTILISATEUR AIME OU N'AIME PLUS LA PUBLICATION
    likePost: function (e){
      e.preventDefault();
      axios.post(`publications/${this.id}/like`, {
        user_id: this.$store.state.userId
      })
          .then((response) => {
            if(response.data.like == 0) { //L'UTILISATEUR AIME DESORMAIS LA PUBLICATION
              this.likes = this.likes.filter(user => user !== this.$store.state.userId)
              document.getElementById("like-button-"+this.id).classList.remove("active");
            } else { // L'UTILISATEUR N'AIME PLUS LA PUBLICATION
              this.likes.push(this.$store.state.userId);
              document.getElementById("like-button-"+this.id).classList.add("active");
            }
            this.$forceUpdate();
          }).catch(error => this.$store.dispatch("sendError", error.response.data));
    },
    deletePublication: function () {
      axios.delete(`publications/${this.id}`)
          .then(() => {
            window.location = "/";
          })
          .catch(error => this.$store.dispatch("sendError", error.response.data))
    },
    loadingCommentaire: function (){
      this.commentaires = [];
      document.getElementById(`commentaires-loading-${this.id}`).classList.remove("d-none");
      //RECUPERATION DES COMMENTAIRES DE LA PUBLICATION
      axios.get(`publications/${this.id}/commentaires`)
          .then(response => {
            const data = response.data;
            data.forEach(commentaire => {
              this.commentaires.push({
                id: commentaire.commentaire_id,
                authorId: commentaire.author_id,
                authorName: commentaire.nom + " " + commentaire.prenom,
                authorAvatar: commentaire.avatar,
                commentaire: commentaire.content,
                date: commentaire.date
              })
            })
            document.getElementById(`commentaires-loading-${this.id}`).classList.add("d-none");
          }).catch(error => this.$store.dispatch("sendError", error.response.data));
    },
    deleteCommentaire: function (e, commentaire_id){
      e.preventDefault()
      axios.delete(`commentaire/${commentaire_id}`)
          .then(response => {
            const div = document.getElementById("commentaire-"+commentaire_id);
            div.classList.add("remove");
            this.$store.dispatch("sendSuccess", response.data.message);
            this.commentaireNumber --;
          })
          .catch(error => this.$store.dispatch("sendError", error.response.data));
    },
    addCommentaire: function (e){
      e.preventDefault();
      if (!this.$refs.commentaire.value) {
        this.$store.dispatch("sendError", "Votre commentaire doit avoir un contenu.")
      } else {
        axios.post("commentaire/add", {
          publicationId: this.id,
          userId: this.$store.state.userId,
          content: this.$refs.commentaire.value
        })
            .then(() => {
              this.$refs.commentaire.value = "";
              this.loadingCommentaire();
              this.$store.dispatch("sendSuccess", "Votre commentaire a été posté.");
              this.commentaireNumber ++;
            })
            .catch(error => this.$store.dispatch("sendError", error.response.data))
      }
    }
  },
  created() {
    //CHARGEMENT DES LIKES DE LA PUBLICATION
    axios.get(`publications/${this.id}/like`).then(response => {
      const data = response.data;
      data.forEach(like => {
        this.likes.push(like.user_id);
      });
      if(this.likes.includes(this.$store.state.userId)){
        document.getElementById("like-button-"+this.id).classList.add("active");
      }
    }).catch(error => this.$store.dispatch("sendError", error.response.data));

    //RECUPERATION DES COMMENTAIRES DE LA PUBLICATION
    axios.get(`publications/${this.id}/commentaires`)
        .then(response => {
          this.commentaireNumber = response.data.length;
        }).catch(error => this.$store.dispatch("sendError", error.response.data));
  },
}
</script>

<style lang="scss">
.publication{
  border: 1px solid gray;

  &-header{
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
  }
  &-body{
    margin: 15px;
    overflow: hidden;
    &-content{
      font-size: 15px;
    }
    &-img{
      margin: 20px 0;
      object-fit: cover;
      max-width: 100%;
    }
  }
  &-footer{
    padding: 18px 0;
    &-item{
      font-size: 18px;
      a{
        color: black;
        text-decoration: none;
        transition: color 0.2s;
        &:hover{
          color: orange;
        }
        &.active{
          color: orangered;
        }
      }
    }
  }
}
.author{
  a{
    color: black;
    text-decoration: none;
    &:hover{
      color: black;
    }
  }
  &-avatar{
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }
  &-name{
    margin-left: 15px;
    font-size: 20px;
  }
}
#publicationSettings{
  color: black;
  text-decoration: none;
  font-size: 22px;
  &:hover{
    color: orange;
  }
}
.commentaire{
  border: 1px lightgray solid;
  box-shadow: 4px 4px 5px lightgray;
  font-size: 18px;
  &-avatar{
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  &-link{
    text-decoration: none;
    color: black;
    transition: all 0.2s;
    &:hover{
      color: orangered;
      text-decoration: underline;
    }
  }
}
.remove{
  height: 0;
  transition: all 0.5s;
  overflow: hidden;
  border: none;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
