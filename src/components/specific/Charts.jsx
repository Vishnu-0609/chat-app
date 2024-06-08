import React from 'react';
import {Line,Doughnut} from "react-chartjs-2";
import {ArcElement, CategoryScale, Chart as ChartJs, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip, plugins} from "chart.js";
import { getLast7Days } from '../../lib/features';
import { orange, orangeLight, purple, purpleLight } from '../constatnts/color';

ChartJs.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
)

const labels = getLast7Days();

const lineChartOptions = {
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },
    scales:{
        x:{
            grid:{
                display:false,
            }
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false,
            }
        }
    }
}

const doughnutOptions = {
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },
    cutout:120,
}

const LineChart = ({value=[]}) => {

    const data = {
        labels:labels,
        datasets:[
            {
                data:value,
                label:"Message",
                fill:true,
                backgroundColor:"rgba(75,12,192,0.2)",
                borderColor:"rgba(75,12,192,1)"
            }
        ],
    }

  return (
    <Line data={data} options={lineChartOptions}/>
  )
}

const DoughnutChart = ({value,labels}) => {
    const data = {
        labels,
        datasets:[
            {
                data:value,
                fill:true,
                backgroundColor:[purpleLight,orangeLight],
                borderColor:[purple,orange],
                hoverBackgroundColor:[purple,orange],
                offset:40,
            }
        ],
    }
    return (
        <Doughnut style={{zIndex:10}} data={data} options={doughnutOptions}/>
    )
}

export {LineChart,DoughnutChart}
