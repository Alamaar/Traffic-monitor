const express = require('express');
const router = express.Router();
const trafficData = require('../services/traffic_data')




router.get('/',(req,res)=> {
    // get data and filter with query params


    const from = req.query.from
    //jne



    try {
       // trafficData.getTrafficData(from, to, objects)
       //jne

        
    } catch (error) {
        
    }

    //placeholder
    res.send('Hello traffic_data!')
    


} )























module.exports = router