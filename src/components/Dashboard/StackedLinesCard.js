import React from 'react';
import StackedLinesChart from '../Charts/StackedLinesChart';

const StackedLinesCard = () => {
  console.log('a7a');
  return (
    <div>
      <header>
        <h5>Courses Attendance Rates</h5>
      </header>
      <div className='stacked-line-chart-container'>
        <StackedLinesChart />
      </div>
    </div>
  );
};
export default StackedLinesCard;
