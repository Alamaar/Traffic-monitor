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



export function Chart(probs) {
  

  let labels = probs.time;

  const options = probs.options
  
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


  


  return <Line options={options} data={data} />;
}
