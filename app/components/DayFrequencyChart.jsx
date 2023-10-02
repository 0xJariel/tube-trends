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
  const createChartDatasets = (data) => {
    if (!data || data.length === 0) {
      return null; // Return null or handle empty data
    }

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const backgroundColors = ["aqua", "red", "purple", "green"];
    const borderColor = ["black", "black", "black", "black"];

    const datasets = [];

    data.forEach((query, index) => {
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

  const options = {}; // You can define options as needed

  return (
    <div>
      {analyzedData.length > 0 ? (
        <div className="grid">
          <div className="mx-auto">Upload Days:</div>
          <div>
            <Bar data={data} options={options} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DayFrequencyChart;
