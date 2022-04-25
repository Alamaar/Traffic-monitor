const express = require('express');
const router = express.Router();
const trafficData = require('../services/traffic_data')


function dataValidator(req,res, next){


}

router.get('/', async (req,res)=> {
    // get data and filter with query params
    // from, to, objects,

    const from = req.query.from 
    const to = req.query.to
    const object = req.query.object
    console.log("fetch")


    try {
        const data = await trafficData.getTrafficData(from, to, object)
        
       res.json({
           data : data
       })
       
       //jne

        
    } catch (error) {
        console.log(error)
        
    }

    //placeholder
   

} )

router.get('/info', async (req,res)=> {
    

    const from = req.query.from 
    const to = req.query.to
    const object = req.query.object


    try {
        const data = await trafficData.getTrafficData(from, to, object)
        
        if (data == false){
            
            res.status(403)

        }
        //Parse data
        //loop array of time chunks and sum all chunks elementes to make total sum in all the times.
        let parsedData = data.reduce(function(prev, current){
            for(let key in current){
                if ( typeof current[key] === "number"){
                    prev[key] = (prev[key] || 0) + (current[key] || 0)
                }
            }
            return prev;

        } )


        //remove unused elements
        delete parsedData.time
        
        res.json({
            data : parsedData
        })

    }
    catch{
        res.status(500)

    }

})

router.get('/live', async (req,res)=> {
    
    res.status(200).json({
        data : await trafficData.getLiveData()
    })

    
})


router.post('/live', (req,res)=> {

    // Schema verification
    const data = req.body.data

    if(req.body.api_key === process.env.API_KEY){
        const resp = trafficData.newLiveData(data)

        if(resp){
            res.sendStatus(201)
        }
        else if(!resp){
            res.sendStatus(401)
        }     
    }

    else{
        res.status(403).send("Unauthorized")
    }
    


    










    
})

router.get('/update', (req,res)=> {

    const data = trafficData.compressTrafficData()


    res.json({
        data : data
    })

    

})

























module.exports = router