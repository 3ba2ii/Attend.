import { NativeSelect } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { filterDataWithDate } from '../../../utlis/helpers/filterDataWithDate';
import { Bar } from 'react-chartjs-2';

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

export const AttendancePerLectureChart = ({
  lectures,
  studentsLength,
  __typename,
}) => {
  const [displayedData, setDisplayedData] = useState();
  console.log(
    `🚀 ~ file: AttendancePerLectureChart.js ~ line 27 ~ AttendancePerLectureChart ~ displayedData`,
    displayedData
  );

  const [filter, setCurrentFilter] = useState('month');

  const data = displayedData
    ? {
        labels:
          Object.values(displayedData).map(
            ({ LectureNumber, SectionNumber }) =>
              `${__typename} ${LectureNumber || SectionNumber}`
          ) || [],

        datasets: [
          {
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data:
              Object.values(displayedData)?.map((lecture) => {
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

      const filteredData = filterDataWithDate({
        data: Object.values(lectures),
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
        <h6>Attendance Per Lecture</h6>
        <aside>
          <SimpleSelect setCurrentFilter={setCurrentFilter} />
        </aside>
      </header>
      <Bar data={data} options={lineOptions} />
    </div>
  );
};

const lineOptions = {
  maintainAspectRatio: true,
  responsive: true,
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

          const { LectureDateTime, LectureName } =
            datasets[0].data[index].lecture;

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
