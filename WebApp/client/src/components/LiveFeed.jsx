import React, {useEffect, useState} from 'react';
import trafficData from '../apis/trafficData';


function LiveFeed(probs) {
        const [liveData, setData] = useState([])

        useEffect(()=> {

            async function fetch(){
                try {
                    const resp = await trafficData.get('/live')
                    console.log(resp.data.data)
                    setData(resp.data.data)

                    
                } catch (error) {
                    console.log(error)
                    
                }
  
            }
            
            fetch()

        },[])

        const elements  = liveData.slice(probs.rows).map((item, index) => {
            
            if(item.speed === undefined){
                return <li> {`${item.class_name}  ${item.direction}`}</li>
            }

            return <li> {`${item.class_name}  ${item.direction} ${item.speed} km/h`}</li>


        })

        console.log(elements)



        return (


        <div>
            <header>Traffic Monitor</header>
            <ul>
                {elements}
            </ul>

        </div>

    )

}




export default LiveFeed