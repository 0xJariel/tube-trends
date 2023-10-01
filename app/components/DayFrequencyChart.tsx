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

const DayFrequencyChart = ({ analyzedData }) => {
  const createChartDatasets = (analyzedData) => {
    // Extract keys and values from the analyzedData object
    // const labels = Object.keys(analyzedData[0].dayCount);
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const backgroundColors = ["aqua", "red", "purple", "green"];
    const borderColor = ["black", "black", "black", "black"];

    const datasets = [];
    analyzedData.forEach((query, index) => {
      console.log(query);
      datasets.push({
        label: query.title,
        data: Object.values(query.dayCount),
        backgroundColor: backgroundColors[index],
        borderColor: borderColor[index],
        borderWidth: 1,
      });
    });
    return { labels, datasets };
  };

  const data = createChartDatasets(analyzedData);

  const options = {};
  return (
    <div>
      <div>Upload Day:</div>
      <div>{analyzedData && <Bar data={data} options={options} />}</div>
    </div>
  );
};

export default DayFrequencyChart;
