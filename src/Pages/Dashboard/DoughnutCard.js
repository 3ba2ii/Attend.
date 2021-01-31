import React from 'react';
import DoughnutChart from '../../components/Charts/DoughnutChart';

const DoughnutCard = () => {
  return (
    <div>
      <header className='responsive-card-header'>
        <h5>Courses Attendance</h5>
      </header>

      <div className='doughnut-chart-container'>
        <DoughnutChart />
      </div>
    </div>
  );
};

export default DoughnutCard;
