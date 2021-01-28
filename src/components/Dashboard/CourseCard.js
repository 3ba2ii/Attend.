import React from 'react';
import LineChart from '../Charts/LineChart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { calculateGrowth, average } from '../../utlis/helpers/calcuateAverage';

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
            {growth >= 0 ? (
              <TrendingUpIcon style={{ color: '#31c977', maxWidth: '21px' }} />
            ) : (
              <TrendingDownIcon
                style={{ color: '#e47c67', maxWidth: '21px' }}
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
