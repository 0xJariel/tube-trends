import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { Bar } from "react-chartjs-2";

const FrequencyChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed"],
    datasets: [
      {
        label: "369",
        data: [3, 6, 9],
        backgroundColor: "aqua",
        borderColor: "black",
        borderWidth: 1,
      },
      {
        label: "333",
        data: [3, 6, 9],
        backgroundColor: "green",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const options = {};
  return (
    <div>
      <div>Chart!</div>
      <div>
        <Bar data={data} options={options}></Bar>
      </div>
    </div>
  );
};

export default FrequencyChart;
