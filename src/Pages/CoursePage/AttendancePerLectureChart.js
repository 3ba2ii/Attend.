import { NativeSelect } from '@material-ui/core';
import { format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { filterDataWithDate } from 'utlis/helpers/filterDataWithDate';
import { CoursePageContext } from './CoursePage';

function SimpleSelect({ setCurrentFilter }) {
  const [filter, setFilter] = React.useState('month');

  const handleChange = (event) => {
    setFilter(event.target.value);
    setCurrentFilter(event.target.value);
  };

  return (
    <NativeSelect
      id='select-filter'
      className='select-filter-container'
      value={filter}
      onChange={handleChange}
    >
      <option value={'week'}>Last Week</option>
      <option value={'month'}>Last Month</option>
      <option value={'3 months'}>Last 3 Months</option>
    </NativeSelect>
  );
}

export const AttendancePerLectureChart = ({ __typename }) => {
  const { studentsData, processedLectures, processedSections } =
    useContext(CoursePageContext);
  const studentsLength = Object.keys(studentsData)?.length;
  const [displayedData, setDisplayedData] = useState();

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
            backgroundColor:
              __typename === 'Lecture'
                ? 'rgba(255, 99, 132, 0.3)'
                : 'rgba(54, 162, 235, 0.2)',
            borderColor:
              __typename === 'Lecture'
                ? 'rgba(255, 99, 132, 1)'
                : 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data:
              Object.values(displayedData)?.map((meeting) => {
                let res = {
                  y:
                    (meeting?.attendances?.length / Number(studentsLength)) *
                    100,
                  meeting,
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
        data:
          __typename === 'Lecture'
            ? Object.values(processedLectures)
            : Object.values(processedSections),
        filterTime: filterDate,
      });

      setDisplayedData(filteredData);
    } catch (e) {
      console.error(e.message);
    }
  }, [filter, __typename, processedLectures, processedSections]);
  return (
    <div className='attendance-per-lecture-chart-container'>
      <SimpleSelect setCurrentFilter={setCurrentFilter} />

      <Bar data={data} options={lineOptions} />
    </div>
  );
};

const lineOptions = {
  maintainAspectRatio: true,
  responsive: true,

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

          const { LectureDateTime, SectionDateTime } =
            datasets[0].data[index].meeting;

          return `${format(
            new Date(LectureDateTime || SectionDateTime),
            'dd MMM yyyy'
          )}`;
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
