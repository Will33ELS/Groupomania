const axios = require("axios");
import store from '../store'

export default axios.create({
    headers: {
        Authorization: store.state.token
    }
});
