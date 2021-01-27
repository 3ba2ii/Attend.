import React from 'react';
import LineChart from '../Charts/LineChart';
let average = (array) => array.reduce((a, b) => a + b) / array.length;
let calculateGrowth = (array) => {
  const oldAverage = average(array.slice(0, array.length - 1));
  const newAverage = average(array);

  return (newAverage - oldAverage).toFixed(1);
};
const CourseCard = ({
  courseID,
  courseName,
  courseAttendance,
  courseImageURL,
  datasetValues,
}) => {
  const growth = calculateGrowth(datasetValues);
  const growthClassName = growth >= 0 ? 'green-stock' : 'red-stock';
  return (
    <div className='course-card-container'>
      <div className='center-area'>
        <header className='course-info'>
          <img src={courseImageURL} alt={'course-image'} />
          <div
            className='course-name'
            style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
          >
            <h5>{courseName}</h5>
          </div>
        </header>
        <div className='course-attendance-rate'>
          <span>{average(datasetValues).toFixed(2)}%</span>
          <div className='vs-last'>
            <b className={growthClassName}>{growth}% </b>vs last lecture
          </div>
        </div>
      </div>
      <LineChart
        datasetValues={datasetValues}
        growthClassName={growthClassName}
      />
    </div>
  );
};

export default CourseCard;
