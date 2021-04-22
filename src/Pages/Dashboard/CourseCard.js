import LineChart from 'components/Charts/LineChart';
import React from 'react';
import { average, calculateGrowth } from 'utlis/helpers/calcuateAverage';

const CourseCard = ({
  courseID,
  courseName,
  courseImageURL,
  datasetValues,
}) => {
  const growth = calculateGrowth(datasetValues);
  const growthClassName = growth >= 0 ? 'green-stock' : 'red-stock';
  return (
    <div className='course-card-container card-shadow'>
      <div className='center-area'>
        <header className='course-info'>
          <img src={courseImageURL} alt={'course-img'} />
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
            {growth >= 0 ? (
              <div className='icons8-up-arrow'></div>
            ) : (
              <div className='icons8-down-arrow'></div>
            )}
            <strong className={growthClassName}>{growth}% </strong>vs last
            lecture
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
