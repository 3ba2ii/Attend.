import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = () => {
  const width = window.screen.width;

  const dataSet = [40, 50, 60, 70];
  const DData = {
    labels: [
      'Pattern Recognition',
      'Neural Network',
      'Fuzzy Control',
      'Circuits',
    ],

    datasets: [
      {
        data: dataSet,

        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,

    legend: {
      align: 'left',
      position: window.screen.width <= 720 ? 'left' : 'top',

      labels: {
        fontSize: width <= 420 ? 8 : 14,
        usePointStyle: true,
        boxWidth: 7,
      },
    },
    tooltips: {
      position: 'average',

      backgroundColor: '#344D6D',
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            ' Att. Rate: ' +
            Number(data.datasets[0].data[tooltipItem.index]).toFixed(1) +
            '%'
          );
        },
      },
    },
  };

  return (
    <div className='doughnut-chart'>
      <Doughnut data={DData} options={options} />
    </div>
  );
};

export default DoughnutChart;
