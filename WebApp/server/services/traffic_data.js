


async function newLiveData(data){
    //Saves incoming live data // 
}


async function newTrafficData(data){
    //Save traffic data
    //data format 
}



async function getLiveData(limit, objects){
    //get all live data, limit latest number of entys, filter by objects = ["car","bus"..etc]


}

async function getTrafficData(from , to, objects  ) {
    //get traffic data from time to to time, and filter results by objects
    // objects = ["car","bus",.... etc]
    // 
    if (from === undefined) {
        //some default value if undefines
    }
    if (to === undefined) {
         //some default value if undefines
    }
    if (objects === undefined) {
         // get all objects
    }




}


module.exports.getLiveData = getLiveData
module.exports.getTrafficData = getTrafficData
module.exports.newLiveData = newLiveData
module.exports.newTrafficData = newTrafficData