const axios = require("axios");
import store from '../store';

// INTERSEPTOR POUR REDEFINIR LE TOKEN

const axiosInstance = axios.create();
axiosInstance.defaults.headers.Authorization = store.state.token;
axiosInstance.defaults.baseURL = "http://localhost:3000";

export default axiosInstance;
