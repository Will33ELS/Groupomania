<template>
  <div id="app">
    <header>
      <Navbar/>
      <hr/>
    </header>
    <main>
      <!-- ALERT DANGER -->
      <div v-if="error != null" class="row justify-content-center">
        <div class="col-12 col-md-8 my-3 alert alert-danger alert-dismissible fade show" role="alert">
          {{ error }}
          <button @click="dismissAlert('danger')" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
      <!-- ALERT SUCCESS -->
      <div v-if="success != null" class="row justify-content-center">
        <div class="col-12 col-md-8 my-3 alert alert-success alert-dismissible fade show" role="alert">
          {{ success }}
          <button @click="dismissAlert('success')" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
      <router-view/>
    </main>
    <footer>
      <div class="row justify-content-between">
        <div class="col">
          <div>Cette application a été conçu afin de communiquer entre salariés de l'entreprise.</div>
          <div>@Copyright, tout droit réservé</div>
        </div>
      </div>
    </footer>

    </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.row{
  margin: 0;
  padding: 0;
}

main{
  min-height: 300px;
}

footer{
  background-color: #f1f1f1;
  padding: 10px;
}

</style>
<script>
import Navbar from "@/components/Navbar";
import { mapState, mapActions } from 'vuex';

export default {
  name: "app",
  computed: {
    ...mapState(['error', 'success'])
  },
  components: {
    Navbar,
  },
  methods:{
    ...mapActions(['dismissAlert'])
  }
};
</script>
