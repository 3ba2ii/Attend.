import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import React from 'react';
import { average, calculateGrowth } from '../../utlis/helpers/calcuateAverage';
import LineChart from '../Charts/LineChart';

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
              <TrendingUpIcon style={{ color: '#31c977', maxWidth: '18px' }} />
            ) : (
              <TrendingDownIcon
                style={{ color: '#e47c67', maxWidth: '18px' }}
              />
            )}
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
