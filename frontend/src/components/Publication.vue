<template>
  <div class="my-5 row justify-content-center">
    <div class="publication col-10">
      <div class="publication-header">
        <div class="author">
          <a href="#" class="d-inline-flex align-items-center">
            <img class="author-avatar" :src="avatar == null ? 'images/avatar-defaut.png' : avatar" alt="Author"/>
            <div class="author-name">
              {{ author }}
            </div>
          </a>
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
          <a href="#">
            <i class="fas fa-comment"></i> Commenter ({{ this.commentaireNumber }})
          </a>
        </div>
      </div>
    </div>
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
      id: this.publication_id
    }
  },
  props:{
    publication_id:{
      type: Number,
      required: true,
    },
    avatar:{
      type: String,
      default: "images/avatar-defaut.png",
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
      axios.post(`http://localhost:3000/publications/${this.id}/like`, {
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
      axios.delete(`http://localhost:3000/publications/${this.id}`)
      .then(() => {
        window.location = "/";
      })
      .catch(error => this.$store.dispatch("sendError", error.response.data))
    }
  },
  created() {
    //CHARGEMENT DES LIKES DE LA PUBLICATION
    axios.get(`http://localhost:3000/publications/${this.id}/like`).then(response => {
      const data = response.data;
      data.forEach(like => {
        this.likes.push(like.user_id);
      });
      if(this.likes.includes(this.$store.state.userId)){
        document.getElementById("like-button-"+this.id).classList.add("active");
      }
    }).catch(error => this.$store.dispatch("sendError", error.response.data));

    //RECUPERATION DES COMMENTAIRES DE LA PUBLICATION
    axios.get(`http://localhost:3000/publications/${this.id}/commentaires`)
    .then(response => {
      this.commentaireNumber = response.data.length;
    }).catch(error => this.$store.dispatch("sendError", error.response.data));
  }
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
</style>
