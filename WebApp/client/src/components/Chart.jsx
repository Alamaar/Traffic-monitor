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



//label options check
//  muokata viel probseilla käytettäväksi
// säätää näkyvyyttä paremmaksi
//parsia aika labelit järkevämksi





export function Chart(probs) {
  //probs -labels, dataset1, dataset2, title, 
  // skaalat voi olla kaikissa lukumäärä charteissa sama, 
  //opsions charts puolelle

  //melkee kaikki charts puolelle tai siis kaikki

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


  //console.log(data)


  return <Line options={options} data={data} />;
}
