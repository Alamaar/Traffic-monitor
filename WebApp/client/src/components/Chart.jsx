import React, {useEffect, useState} from 'react';
import trafficData from '../apis/trafficData';
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' 
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};
//label options check



const labels = ["2022-04-12T12:49:50", 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [3,4,5,6,7,7],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [3,4,5,6,7,7],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function Chart() {

  //probs määritys mikä data, väli?, otsikko, 
  // hakee joka componentille itsekseen erikseen apista tiedot? turhaa resurseja?
  // ylemmän tason probs josta data tulee?
  //datan parsiminen
  //ylimääräsiä pois


  const [liveData, setData] = useState(data)


  useEffect(()=> {

    async function fetch(){
        try {
            const resp = await trafficData.get('/')
            console.log(resp.data.data)
            setData({

            })
            

            
        } catch (error) {
            console.log(error)
            
        }

    }
    
    fetch()

},[])













  return <Line options={options} data={data} />;
}
