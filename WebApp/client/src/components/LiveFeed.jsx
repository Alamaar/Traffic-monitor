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

            const interval = setInterval(()=> {
                fetch()
            },100);

            return () => clearInterval(interval)
            

        },[])

        const elements  = liveData.slice(probs.rows).map((item, index) => {        
            if(item.speed === undefined){
                return <a className='item'> {`${item.className}  ${item.direction}`}</a>
            }
            return <a className='item'> {`${item.className}  ${item.direction} ${Math.floor(item.speed)} km/h`}</a>


        })

        console.log(elements)



        return (


        <div  className='LiveFeed'>           
                {elements}
            
        </div>

    )

}




export default LiveFeed