import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export const DoughnutChart = ({ labelsDataSet, studentsLength, options }) => {
  const DData = {
    labels: Object.keys(labelsDataSet),

    datasets: [
      {
        data: Object.values(labelsDataSet).map(
          (value) => (value * 100) / studentsLength
        ),

        backgroundColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  };

  return (
    <div className='doughnut-chart-container'>
      <Doughnut data={DData} options={options} />
    </div>
  );
};
