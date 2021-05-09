import { NativeSelect } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function SimpleSelect({ setCurrentFilter }) {
  const [filter, setFilter] = React.useState('month');

  const handleChange = (event) => {
    setFilter(event.target.value);
    setCurrentFilter(event.target.value);
  };

  return (
    <div>
      <NativeSelect id='select' value={filter} onChange={handleChange}>
        <option value={'week'}>Last Week</option>
        <option value={'month'}>Last Month</option>
        <option value={'3 months'}>Last 3 Months</option>
      </NativeSelect>
    </div>
  );
}
const getFilteredDataResult = ({ data, filterTime }) => {
  try {
    const filteredData = data.filter(
      ({ LectureDateTime }) => new Date(LectureDateTime) >= new Date(filterTime)
    );
    return filteredData;
  } catch (err) {
    console.error(err.message);
    return data;
  }
};
const lineOptions = {
  maintainAspectRatio: true,
  gridLines: {
    display: false,
  },

  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 100,
          stepSize: 20,
          fontSize: 12,
          fontFamily: 'Poppins',
          fontColor: '#334d6e',
          callback: function (value) {
            return '%' + value;
          },
          ticks: {
            beginAtZero: true,
            suggestedMax: 110,
          },
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: 12,
          fontFamily: 'Poppins',
          fontColor: '#334d6e',
          fontWeight: 600,
        },
        callback: function (value, index, values) {
          return 'Lecture' + value;
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
      title: function (tooltipItem, _) {
        try {
          const { xLabel } = tooltipItem[0];

          return xLabel;
        } catch (e) {
          console.error(e.message);
          return 'Attendance Rate';
        }
      },
      afterTitle: function (tooltipItem, { datasets }) {
        try {
          const { index } = tooltipItem[0];

          const { LectureDateTime, LectureName } = datasets[0].data[
            index
          ].lecture;

          return `${LectureName} - ${new Date(
            LectureDateTime
          ).toLocaleDateString()}`;
        } catch (e) {
          console.error(e.message);
          return 'Attendance Rate';
        }
      },
      label: function (tooltipItem, _) {
        return ' Att. Rate: ' + Number(tooltipItem.yLabel).toFixed(1) + '%';
      },
    },
  },
};

export const AttendancePerLectureChart = ({ lectures, studentsLength }) => {
  const [displayedData, setDisplayedData] = useState();

  const [filter, setCurrentFilter] = useState('month');

  const data = displayedData
    ? {
        labels:
          displayedData?.map(
            ({ LectureNumber }) => `Lecture ${LectureNumber}`
          ) || [],
        datasets: [
          {
            label: ' Att. Rate',

            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',

            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,

            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 20,
            backgroundColor: ['rgba(54, 162, 235, 0.05)'],
            fill: true,
            borderColor: 'rgba(54, 162, 235, 1)',
            lineTension: 0,

            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            data:
              displayedData?.map((lecture) => {
                let res = {
                  y:
                    (lecture?.attendances?.length / Number(studentsLength)) *
                    100,
                  lecture,
                };
                return res;
              }) || [],
          },
        ],
      }
    : {};

  useEffect(() => {
    let filterDate = new Date();
    const today = new Date();
    try {
      switch (filter) {
        case 'week':
          filterDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 7
          );
          break;

        case 'month':
          filterDate = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
          );
          break;

        case '3 months':
          filterDate = new Date(
            today.getFullYear(),
            today.getMonth() - 3,
            today.getDate()
          );
          break;
        default:
          break;
      }

      const filteredData = getFilteredDataResult({
        data: lectures,
        filterTime: filterDate,
      });

      setDisplayedData(filteredData);
    } catch (e) {
      console.error(e.message);
    }
  }, [filter, lectures]);
  return (
    <div className='attendance-per-lecture-chart-container'>
      <header>
        <h5>Attendance Per Lecture</h5>
        <aside>
          <SimpleSelect setCurrentFilter={setCurrentFilter} />
        </aside>
      </header>
      <Line data={data} options={lineOptions} />
    </div>
  );
};
