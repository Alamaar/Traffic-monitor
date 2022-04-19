import React, {useEffect, useState} from 'react';
import trafficData from '../apis/trafficData';


function Charts(probs) {
        const [liveData, setData] = useState([])

        useEffect(()=> {

            async function fetch(){
                try {
                    const resp = await trafficData.get('/')
                    console.log("charts")
                    console.log(resp.data.data)
                    setData(resp.data.data)

                    
                } catch (error) {
                    console.log(error)
                    
                }
  
            }
            
            fetch()

        },[])

        /*const elements  = liveData.reduce((prev, current) =>{

            return  current

        })*/
           
            
        
        

        return (


        <div>
            <header>Traffic Monitor</header>
            <ul>
                
            </ul>

        </div>

    )

}




export default Charts