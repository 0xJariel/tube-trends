import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { Bar } from "react-chartjs-2";

// Define an interface for the structure of analyzedData objects
interface AnalyzedDataItem {
  title: string;
  dayCount: Record<string, number>; // Assuming dayCount is an object with string keys and number values
}

interface DayFrequencyChartProps {
  analyzedData: AnalyzedDataItem[];
}

const DayFrequencyChart: React.FC<DayFrequencyChartProps> = ({
  analyzedData,
}) => {
  const createChartDatasets = (
    data: AnalyzedDataItem[] | null
  ): Chart.ChartData<"bar", number[], string> | null => {
    if (!data || data.length === 0) {
      return null; // Return null or handle empty data
    }

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const backgroundColors = ["aqua", "red", "purple", "green"];
    const borderColor = ["black", "black", "black", "black"];

    const datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[] = [];

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

  const options = {}; // You can define options with the appropriate type

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
