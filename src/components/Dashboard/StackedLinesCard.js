import React from 'react';
import StackedLinesChart from '../Charts/StackedLinesChart';

const StackedLinesCard = () => {
  return (
    <div>
      <header className='responsive-card-header'>
        <h5>Courses Attendance Rates</h5>
      </header>
      <div className='stacked-line-chart-container'>
        <StackedLinesChart />
      </div>
    </div>
  );
};
export default StackedLinesCard;
