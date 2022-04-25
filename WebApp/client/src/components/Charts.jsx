import React, {useEffect, useState} from 'react';
import trafficDatafetch from '../apis/trafficData';
import { Chart } from './Chart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


function Charts(probs) {

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' 
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          }},
          scales: {

            yAxis:{
                suggestedMin : 0,
                suggestedMax : 50,
            },
            
            xAxis: {
                
            
                grid: {
                    display: true,
                    drawBorder:true,
                    drawOnChartArea: true,
                    drawTicks: true,
                  },
                display : true,
                
                //type : 'time',
                /*time: {
                  unit: 'hour',
                  displayFormats: {
                    quarter: 'MMM YYYY'
                  }
                },*/
                ticks: {
                    maxTicksLimit: 3,
                    maxRotation: 0,
                    minRotation: 0
                },
                      xAxes: {
                          ticks:'auto', 
                          type: 'time',
                        time: {
                            unit: 'hour',
                            
                            displayFormats: {
                                hour: 'HH'
                            },
                            parser: function (utcMoment) {
                                return utcMoment.utcOffset('+0300');
                            }
                        },
                          
                      },
                  }
              }
          }
          let labels = []
          let data = {
            labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: probs.east,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Dataset 2',
                data: probs.west,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
           
          }




        const [trafficData, setData] = useState([0])

       

        function parseTrafficData(trafficData){
            //spagehetti
            const trafficDataParsed  = trafficData.reduce((prev, current) =>{


            /* 

            expressiin vielä id mukaan tietoihin kun tarvii mappiin kummiskin

            */



            /*console.log("prev")
            console.log(prev)

            console.log("current")
            console.log(current)*/

            function valuesToArrays(oldobject){
            
                let object = {...oldobject}

               

                //.log(object)
                for (const [key, value] of Object.entries(object)) {
                    
                   // console.log(typeof object[key])
                    if(Array.isArray(object[key])){
                        //console.log("push")
                       object[key].push(value)

                    }
                    else{
                        object[key] = []
                        object[key].push(value)
                    }
                    
                }
                return object
            }


            for (const [key, value] of Object.entries(current)) {
                
                
                if(value.constructor.name === "Object" && value !== undefined && value !== null){
                    //prev[key] = valuesToArrays(value)
                    for (const [key2, value2] of Object.entries(value)) {
                    
                        
                        if(Array.isArray(prev[key][key2])){
                            //console.log("push")
                           prev[key][key2].push(value2)
    
                        }
                        else{
                            prev[key][key2] = []
                            prev[key][key2].push(value2)
                        }
                }
            }
                else {
                    if(Array.isArray(prev[key])){
                        prev[key].push(value)

                    }
                    else{
                        prev[key] = []
                        prev[key].push(value)
                    }

                }


            }

              return prev



        })

        return trafficDataParsed

    }

    useEffect(()=> {

        async function fetch(){
            try {
                const resp = await trafficDatafetch.get('/')
                //console.log("charts")
                //onsole.log(resp.data.data)
                setData(parseTrafficData(resp.data.data))

                
            } catch (error) {
                console.log(error)
                
            }

        }
        
        fetch()

    },[])

    console.log(trafficData)
        //console.log("parsed")
        

        
           
        let west = []
        let east = []
        if(trafficData.car !== undefined)
        {
            west = trafficData.car.speed_west
            east = trafficData.car.speed_east
        }
        
        //console.log("rerender")
        //console.log(east)

        const elements = []
        data.labels = trafficData.time

        console.log(data.labels)

        for(const [key, value] of Object.entries(trafficData)){
            
            if(key !== "time"){
                
                options.plugins.title.text = key.toUpperCase()
                data.datasets[0].data = value.east
                data.datasets[0].label = "East"
                data.datasets[1].data = value.west
                data.datasets[1].label = "West"
                elements.push(<div><Line className='Line' options={JSON.parse(JSON.stringify(options))} data={JSON.parse(JSON.stringify(data))}/></div>)

                if(key === "car"){
                    options.plugins.title.text = key.toUpperCase() + " km/h"
                    data.datasets[0].data = value.speed_east
                    data.datasets[0].label = "East"
                    data.datasets[1].data = value.speed_west
                    data.datasets[1].label = "West"
                    elements.push(<div><Line className='Line' options={JSON.parse(JSON.stringify(options))} data={JSON.parse(JSON.stringify(data))}/></div>)

                }
                

                
            }

        }
        




        return (

           

        <div className='Charts'> 







        
                {elements}
        </div>

    )

}




export default Charts