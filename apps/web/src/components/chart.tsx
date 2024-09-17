import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip);

interface ChartProps {
  data: number[];
  labels: string[];
  title: string;
}
export const Chart: React.FC<ChartProps> = ({ data, labels, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};
