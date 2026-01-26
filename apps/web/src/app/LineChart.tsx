"use client";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

const salesData = [
  { month: "January", sales: 100 },
  { month: "February", sales: 150 },
  { month: "March", sales: 200 },
  { month: "April", sales: 120 },
  { month: "May", sales: 180 },
  { month: "June", sales: 250 },
  { month: "June", sales: 250 },
  { month: "June", sales: 450 },
  { month: "June", sales: 650 },
  { month: "June", sales: 150 },
];

const salesData2 = [
  { month: "January", sales: 344 },
  { month: "February", sales: 456 },
  { month: "March", sales: 665 },
  { month: "April", sales: 656 },
  { month: "May", sales: 556 },
  { month: "June", sales: 344 },
  { month: "June", sales: 978 },
  { month: "June", sales: 766 },
  { month: "June", sales: 566 },
  { month: "June", sales: 464 },
];

function LineChart() {
  const data = {
    labels: salesData.map((data) => data.month),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((data) => data.sales),
        borderColor: "#f26c6d",
        pointBorderColor: "transparent",
        pointBorderWidth: 4,
        tension: 0.5,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#f26c6d");
          gradient.addColorStop(1, "white");
          return gradient;
        },
      },
      // {
      //   label: "Views",
      //   data: salesData2.map((data) => data.sales),
      //   borderColor: "#f797e1",
      //   pointBorderColor: "transparent",
      //   pointBorderWidth: 4,
      //   tension: 0.5,
      //   fill: true,
      //   backgroundColor: (context: any) => {
      //     const ctx = context.chart.ctx;
      //     const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      //     gradient.addColorStop(0, "#f797e1");
      //     gradient.addColorStop(1, "white");
      //     return gradient;
      //   },
      // }
    ],
  };

  const options = {
    plugins: {
      legend: false,
    },
    responsive: true,
    scales: {
      y: {
        grid: {
          display: true,
        },
        // ticks: {
        //   font: {
        //     size: 17,
        //     weight: "bold",
        //   },
        // },
        // title: {
        //   display: false,
        //   text: "Sales",
        //   padding: {
        //     bottom: 10,
        //   },
        //   font: {
        //     size: 30,
        //     style: "italic",
        //     family: "Arial",
        //   },
        // },
        min: 0,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 2,
          callback: (value: any) => value + "k"
        },
        // ticks: {
        //   font: {
        //     size: 17,
        //     weight: "bold",
        //   },
        // },
        // title: {
        //   display: false,
        //   text: "Month",
        //   padding: {
        //     top: 10,
        //   },
        //   font: {
        //     size: 30,
        //     style: "italic",
        //     family: "Arial",
        //   },
        // },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        padding: "20px",
        cursor: "pointer",
      }}
    >
      <Line data={data} options={options}></Line>
    </div>
  );
}

export default LineChart;
