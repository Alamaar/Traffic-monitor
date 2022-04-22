const db = require("../db");



let liveData = []


/* kirjoita cron tabi ajastus muutetavaksi env muuttujalla  */




async function newLiveData(data){
    //Saves incoming live data // 

    liveData = liveData.concat(data)
    
}


async function newTrafficData(data){
    //Save traffic data
    //data format 


    try {
        const res = await db.query("insert into traffic_others ( person_west, person_east, bus_west, bus_east, truck_east, truck_west, bicycle_west, bicycle_east,dog_west, dog_east,motorcycle_west, motorcycle_east,time) Values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
        [data.person.West, data.person.East, data.bus.West, data.bus.East,data.truck.West,data.truck.East,data.bicycle.West,
        data.bicycle.East, data.dog.West,data.dog.East,data.motorcycle.West,data.motorcycle.East,data.time]
        )
        
        const res2 = await db.query("INSERT INTO cars (west,east,speed_west,speed_east,time) VALUES ($1,$2,$3,$4,$5)",
        [data.car.West,data.car.East, data.car.West_mean, data.car.East_mean,data.time])
    } catch (error) {
        
    }




}



async function getLiveData(limit, objects){
    //get all live data, limit latest number of entys, filter by objects = ["car","bus"..etc]
    return liveData

}

async function getTrafficData(from, to, object  ) {
    //get traffic data from time to to time, and filter results by objects
    // objects = ["car","bus",.... etc]
    //  limit ?
    //

    const preparedColums = {
        bus : "bus_east, bus_west,traffic_others.time",
        car : "west,east,speed_west,speed_east,traffic_others.time",
        dog : "dog_east, dog_west,traffic_others.time",
        truck : "truck_east, truck_west,traffic_others.time",
        person : "person_east, person_west,traffic_others.time",
        bicycle : "bicycle_east, bicycle_west,traffic_others.time",
        motorcycle : "motorcycle_east,motorcycle_west,traffic_others.time"
    }
    

    const selectecColums = preparedColums[object] || "*"

    

   

    if (from === undefined) {
        //some default value if undefined
        from = '2000-01-01'

    }
    if (to === undefined) {
         //some default value if undefines
         to = 'now()'
    }
  
       try {
        const data = await db.query(`SELECT ${selectecColums} FROM traffic_others FULL JOIN cars ON traffic_others.time = cars.time WHERE traffic_others.time >= $1 AND traffic_others.time <= $2`,[from, to] )


        
        const parsed = data.rows.map((item, index) => {
            return {
                car : {
                    west: item.west,
                    east: item.east,
                    speed_west : item.speed_west,
                    speed_east : item.speed_east

                },
                person : {
                    west : item.person_west,
                    east : item.person_east
                },
                bus : {
                    west : item.bus_west,
                    east : item.bus_east
                },
                truck : {
                    west : item.truck_west,
                    east : item.truck_east
                },
                bicycle : {
                    west : item.bicycle_west,
                    east : item.bicycle_east
                },
                dog : {
                    west : item.dog_west,
                    east : item.dog_east
                },
                motorcycle : {
                    west : item.motorcycle_west,
                    east : item.motorcycle_east
                },
                time : item.time

            }


        })

        

 
        return parsed
       } catch (error) {
           console.log(error)
           return false
           
       }
        
}


function compressTrafficData(){

    //copy and empty live data
    const data =   [...liveData]
    liveData = []

    //For car specific calculations
    allSpeeds = {
        West : [],
        East : []
    }
  
    if(data[data.length - 1] === undefined)
        return 0
    time = data[data.length - 1].time 

    //data pack init
    compressedData = {
        person : {  West : 0,
                    East : 0},
        bus : {     West : 0,
                    East : 0},
        truck : {   West : 0,
                    East : 0},
        bicycle: {  West : 0,
                    East : 0},
        dog : {     West : 0,
                    East : 0},
        motorcycle:{West : 0,
                    East : 0},
        car : {     West : 0,
                    East : 0,
                    East_mean : 0,
                    West_mean : 0,
                    },
        time : time
    }
   
    //loop thru live data and compare names to initialized compressedData and add one occurance for each element found
    //take speeds to list if its car
    data.forEach(element => {
        if (element.className in compressedData){
            if (element.direction in compressedData[element.className]){       
                compressedData[element.className][element.direction] += 1

                if(element.className == "car"){
                    allSpeeds[element.direction].push(element.speed)
                }
            }
        }

    })

    Object.keys(allSpeeds).forEach(key => {
        n = 0
        total = 0
        speeds = allSpeeds[key]
        let min = speeds[0]
        let max = speeds[0]
        speeds.forEach(speed => {
            n += 1
            total += speed
        })
        mean = Math.round(total / n)

        if(key == "West"){
            compressedData.car.West_mean = mean
        }
        if(key == "East"){
            compressedData.car.East_mean = mean
        }


    })

    newTrafficData(compressedData)
    return compressedData

}

var CronJob = require('cron').CronJob;
var job = new CronJob('0 */10 * * * *', function() {
    compressTrafficData()
});
job.start();


module.exports.getLiveData = getLiveData
module.exports.getTrafficData = getTrafficData
module.exports.newLiveData = newLiveData
module.exports.newTrafficData = newTrafficData
module.exports.compressTrafficData = compressTrafficData