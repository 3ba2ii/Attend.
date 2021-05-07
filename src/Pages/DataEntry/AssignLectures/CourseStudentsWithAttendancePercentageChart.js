import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export const CourseStudentsWithAttendancePercentageChart = ({
  labelsDataSet,
  studentsLength,
  lectures,
}) => {
  console.log(
    `🚀 ~ file: CourseStudentsWithAttendancePercentageChart.js ~ line 9 ~ lectures`,
    lectures
  );
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
    <div className='doughnut-chart'>
      <span>
        Students with
        <br /> Attendance Rates:
      </span>
      <Doughnut data={DData} options={options} />
    </div>
  );
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  responsiveAnimationDuration: 0,

  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 0,
    },
  },

  legend: {
    align: 'end',
    position: 'right',

    labels: {
      fontSize: 14,
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
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      },
    },
  },
};
