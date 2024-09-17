'use client';
import { useEffect } from 'react';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

const ChartKomponen: React.FC = () => {
  useEffect(() => {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;

    if (ctx) {
      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: [
            'Rock',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Des',
          ],
          datasets: [
            {
              data: [86, 114, 106, 106, 107, 111, 133, 106, 106, 107, 111, 133],
              label: 'Tersisa',
              borderColor: 'rgb(62,149,205)',
              backgroundColor: 'rgba(62,149,205,0.1)',
            },
            {
              data: [70, 90, 44, 60, 83, 90, 100, 106, 106, 107, 111, 133],
              label: 'Terjual',
              borderColor: 'rgb(60,186,159)',
              backgroundColor: 'rgba(60,186,159,0.1)',
            },
          ],
        } as ChartData<'line'>,
        options: {} as ChartOptions<'line'>, // Customize your chart options here
      };

      new Chart(ctx, chartConfig);
    }
  }, []);

  return (
    <>
      {/* Filled line chart */}
      <h1 className="w-[150px] mx-auto mt-10 text-xl font-semibold capitalize">
        Filled line Chart
      </h1>
      <div className="w-[1100px] h-screen flex mx-auto my-auto">
        <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </>
  );
};

export default ChartKomponen;
