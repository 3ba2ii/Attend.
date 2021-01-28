import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const months = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May.',
  'June.',
  'July',
  'Aug.',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
];

const StackedLinesChart = () => {
  const [chartData, setChartData] = useState({});
  const [doughnutData, setDoughnutData] = useState({});

  const setDData = () => {
    setDoughnutData({
      labels: [
        'Pattern Recognition',
        'Neural Network',
        'Fuzzy Control',
        'Circuits',
      ],

      datasets: [
        {
          data: [40, 50, 60, 70],

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
    });
  };
  const chart = () => {
    setChartData({
      labels: months,

      datasets: [
        {
          label: 'Pattern Recognition',
          data: [50, 30, 60, 70, 80, 60, 65, 48, 70, 60, 77, 77],
          borderWidth: 3,
          backgroundColor: ['rgba(54, 162, 235, 0.05)'],
          fill: true,

          borderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 3,
          lineTension: 0,
        },
        {
          label: 'Neural Network',

          data: [50, 30, 55, 66, 57, 75, 75, 58, 59, 50, 70, 70],
          borderWidth: 3,
          backgroundColor: ['#FF638111'],
          borderColor: '#FF6384',
          fill: true,

          pointRadius: 3,
          spanGaps: true,
          lineTension: 0,
        },
        {
          label: 'Network',
          data: [50, 50, 30, 35, 34, 40, 32, 44, 38, 40, 40, 40],
          borderWidth: 3,
          borderColor: ['rgba(153, 102, 255, 1)'],
          backgroundColor: 'rgba(153, 102, 255, 0.05)',
          borderColor: 'rgba(153, 102, 255, 1)',
          lineTension: 0,
          pointRadius: 3,
          spanGaps: true,
          fill: true,
        },
      ],
    });
  };

  useEffect(() => {
    chart();
    setDData();
  }, []);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          /* scaleLabel: {
            display: true,
            labelString: 'Attendance Percentage',
            fontSize: 16,
            fontColor: '#334D6E',
            padding: 20,
          }, */
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 100,
            stepSize: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 4,
      },
    },
  };

  return (
    <div className='stacked-chart'>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StackedLinesChart;
