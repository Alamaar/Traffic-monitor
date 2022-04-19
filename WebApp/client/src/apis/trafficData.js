const axios = require('axios').default;


export default axios.create({
    baseURL : "http://localhost:4000/traffic_data",
    timout : 1000

})