import { CoursePageContext } from 'pages/CoursePage/CoursePage';
import React from 'react';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';

export const DoughnutChart = ({ options }) => {
  const [labelsDataSet, setLabelDataSet] = useState({
    'Below 20%': 0,
    '20% - 40%': 0,
    '40% - 60%': 0,
    '60% - 80%': 0,
    'Above 80%': 0,
  });
  const { studentsData, processedLectures, processedSections } =
    useContext(CoursePageContext);

  const studentsLength = Object.keys(studentsData)?.length || 1;

  useEffect(() => {
    let finalResults = {
      'Below 20%': 0,
      '20% - 40%': 0,
      '40% - 60%': 0,
      '60% - 80%': 0,
      'Above 80%': 0,
    };
    const lecturesCount = Object.keys(processedLectures).length;
    Object.values(studentsData).forEach(({ course: { lectures } }) => {
      const percentage = (
        (Number(lectures.size) / lecturesCount) *
        100
      ).toFixed();

      if (percentage > 80) {
        finalResults['Above 80%'] += 1;
      } else if (percentage > 60 && percentage <= 80) {
        finalResults['60% - 80%'] += 1;
      } else if (percentage > 40 && percentage <= 60) {
        finalResults['40% - 60%'] += 1;
      } else if (percentage > 20 && percentage <= 40) {
        finalResults['20% - 40%'] += 1;
      } else {
        finalResults['Below 20%'] += 1;
      }
    });
    setLabelDataSet(finalResults);
  }, [studentsData]);
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
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
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
