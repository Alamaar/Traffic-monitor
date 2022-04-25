import React, {useEffect, useState} from 'react';
import trafficDatafetch from '../apis/trafficData';
import { Chart } from './Chart';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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

//Chart options
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
      function toISOLocal(d) {
        var z  = n =>  ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off > 0? '-' : '+';
        off = Math.abs(off);
      
        return d.getFullYear() + '-'
               + z(d.getMonth()+1) + '-' +
               z(d.getDate()) + 'T' +
               z(d.getHours()) + ':'  + 
               z(d.getMinutes()) + ':' +
               z(d.getSeconds()) + '.' +
               zz(d.getMilliseconds()) +
               sign + z(off/60|0) + ':' + z(off%60); 
      }

function Charts(probs) {
    const now = new Date()
    now.setDate(now.getDate() - 1 )
    const [date, setDateValue] = useState( {
            from : now,
            to : new Date()}
    )


   // Chart dataset options
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

                    if(prev[key] === undefined){
                        prev[key] = []
                    }
                
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
    },[] )

    return trafficDataParsed

    }

    console.log(date)

    useEffect(()=> {

        async function fetch(){
            try {
                
                const resp = await trafficDatafetch.get(`/?from=${encodeURIComponent(toISOLocal(date.from))}&to=${encodeURIComponent(toISOLocal(date.to))}`)
                console.log(`/?from=${date.from.toISOString()}&to=${date.to.toISOString()}`)
                console.log(resp.data.data)
                setData(parseTrafficData(resp.data.data))
                      
            } catch (error) {
                console.log(error)
                
            }

        }
        
        fetch()

    },[date])

    console.log(trafficData)
        //console.log("parsed")
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
        
        console.log(trafficData)




        return (

           

        <div className='Charts'> 


        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="From"
            value={date.from}
            ampm = {false}
            onChange={(newValue) => {
                setDateValue(date => ({...date, from : newValue}));
            }}
            />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="To"
            value={date.to}
            ampm = {false}
            onChange={(newValue) => {
                setDateValue(date => ({...date, to : newValue}));
            }}
            />
        </LocalizationProvider>




        
                {elements}
        </div>

    )

}




export default Charts