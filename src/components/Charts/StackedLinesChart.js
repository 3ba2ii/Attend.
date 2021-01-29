import React from 'react';
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
  const width = window.screen.width;
  const pointsAndLinesWidth = width >= 1024 ? 2 : 2;
  const labelsAlignment = width >= 1024 ? 'center' : 'left';
  const chartData = {
    labels: months,

    datasets: [
      {
        label: 'Pattern Recognition',
        data: [50, 30, 60, 70, 80, 60, 65, 48, 70, 60, 77, 77],
        borderWidth: pointsAndLinesWidth,
        pointRadius: pointsAndLinesWidth,
        backgroundColor: ['rgba(54, 162, 235, 0.05)'],
        fill: true,
        borderColor: 'rgba(54, 162, 235, 1)',
        lineTension: 0,

        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Neural Network',
        data: [50, 30, 55, 66, 57, 75, 75, 58, 59, 50, 70, 70],
        borderWidth: pointsAndLinesWidth,
        pointRadius: pointsAndLinesWidth,
        backgroundColor: ['#FF638111'],
        borderColor: '#FF6384',
        fill: true,
        spanGaps: true,
        lineTension: 0,
      },
      {
        label: 'Network',
        data: [50, 50, 30, 35, 34, 40, 32, 44, 38, 40, 40, 40],
        borderWidth: pointsAndLinesWidth,
        pointRadius: pointsAndLinesWidth,
        backgroundColor: 'rgba(153, 102, 255, 0.05)',
        borderColor: 'rgba(153, 102, 255, 1)',
        lineTension: 0,
        pointHitRadius: 10,
        spanGaps: true,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 100,
            stepSize: 50,
            fontSize: 10,
            fontFamily: 'Poppins',
            fontColor: '#334d6e',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontSize: 13,
            fontFamily: 'Poppins',
            fontColor: '#334d6e',
          },
        },
      ],
    },
    legend: {
      align: labelsAlignment,

      padding: 10,
      fullWidth: true,
      labels: {
        fontSize: width <= 520 ? 10 : 14,
        usePointStyle: true,
        boxWidth: 4,
      },
    },
    tooltips: {
      position: 'average',
      backgroundColor: '#344D6D',
      callbacks: {
        label: function (tooltipItem, _) {
          return ' Att. Rate: ' + Number(tooltipItem.yLabel).toFixed(1) + '%';
        },
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
