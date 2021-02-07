const axios = require("axios");
import store from '../store';

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = "http://localhost:3000";

axiosInstance.interceptors.request.use((config) => {
    config.headers = {
        Authorization: `${store.state.token}`
    }
    return config;
});

//INTERCEPTION DES REPONSES, SI UNE REPONSE RETOURNE UNE ERREUR 401. DECONNEXION DE L'UTILISATEUR
axiosInstance.interceptors.response.use((response) => { return response }, (error) =>{
    if(error.response.status === 401){
        console.log(error);
        store.dispatch("authLogout").then(() => window.location = "/login");
    }
    return Promise.reject(error);
});

export default axiosInstance;
