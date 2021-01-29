import { Line } from 'react-chartjs-2';

const LineChart = ({
  type,
  period,
  filter,
  text,
  courseID,
  options,
  datasetValues,
  growthClassName,
}) => {
  const colors =
    growthClassName === 'green-stock'
      ? {
          backgroundColor: 'rgba(75,192,192,0.08)',
          borderColor: 'rgba(75,192,192,1)',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        }
      : {
          backgroundColor: 'rgba(228,124,103,0.08)',
          borderColor: '#E47C67',
          pointBorderColor: '#E47C67',
          pointHoverBackgroundColor: '#E47C67',
        };
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: ' Att. Rate',
        ...colors,
        fill: true,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',

        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,

        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: datasetValues,
        lineTension: 0.3,
      },
    ],
  };

  const lineOptions = {
    /* animation: {
      duration: 0,
    }, */
    maintainAspectRatio: true,
    gridLines: {
      z: 2,
    },

    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: null,
          },
        },
      ],
      yAxes: [
        {
          // stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            display: null,
            suggestedMax: 110,
            suggestedMin: Math.min(Math.min(...datasetValues) - 50, -40),
          },
        },
      ],
    },
    legend: {
      display: false,
      usePointStyle: true,
    },
    tooltips: {
      mode: 'index',
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
    <div className='line-chart-container'>
      <Line data={data} options={lineOptions} />
    </div>
  );
};

export default LineChart;
