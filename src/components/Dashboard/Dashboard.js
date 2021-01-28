import './dashboard.css';

import React from 'react';
import CourseCard from './CourseCard';
import patternRecognition from '../../assets/courseImg.png';
import mc from '../../assets/mc.png';
import ai from '../../assets/ai.png';
import circuits from '../../assets/circuits.png';
import StackedLinesCard from './StackedLinesCard';

const cardData = [
  {
    courseName: 'Pattern Recognition',
    courseAttendance: 99,
    courseImageURL: patternRecognition,
    datasetValues: [90, 25, 80, 63, 70, 80, 99],
  },
  {
    courseName: 'Circuits',
    courseAttendance: 70,
    courseImageURL: circuits,
    datasetValues: [80, 99, 50, 99, 50, 60, 70],
  },
  {
    courseName: 'Artificial Intelligence',
    courseAttendance: 50,
    courseImageURL: ai,
    datasetValues: [80, 40, 70, 10, 99, 89, 50],
  },
  {
    courseName: 'Microcontollers',
    courseAttendance: 99,
    courseImageURL: mc,
    datasetValues: [20, 99, 70, 10, 70, 89, 99],
  },
  {
    courseName: 'Pattern Recognition',
    courseAttendance: 99,
    courseImageURL: patternRecognition,
    datasetValues: [20, 99, 70, 10, 70, 89, 99],
  },
  {
    courseName: 'Circuits',
    courseAttendance: 99,
    courseImageURL: circuits,
    datasetValues: [80, 40, 70, 10, 99, 89, 50],
  },
  {
    courseName: 'Artificial Intelligence',
    courseAttendance: 99,
    courseImageURL: ai,
    datasetValues: [20, 99, 70, 10, 70, 89, 99],
  },
  {
    courseName: 'Microcontollers',
    courseAttendance: 99,
    courseImageURL: mc,
    datasetValues: [80, 40, 70, 10, 99, 89, 50],
  },
];

const Dashboard = () => {
  return (
    <main id='dashboard-container'>
      <header className='page-name'>
        <h5>Dashboard and Statistics 📈</h5>
      </header>
      <div className='cards-container'>
        {cardData.map((card, index) => (
          <CourseCard key={card.courseName + index} {...card} />
        ))}
      </div>
      <div className='dashboard-second-row-container'>
        <div className='stacked-lines-container card-shadow'>
          <StackedLinesCard />
        </div>
        <div className='doughnut-chart'>
          Esse exercitation sit ullamco dolor dolore in et in sunt duis.Id
          veniam sunt in nostrud ullamco ex ullamco exercitation sint eiusmod
          proident dolore fugiat.Et ex Lorem aute laborum quis reprehenderit
          quis.Ullamco sit aliqua nostrud eu ullamco eiusmod ex et.
        </div>

        <div className='overall-attendance-rate'>
          Esse exercitation sit ullamco dolor dolore in et in sunt duis.Id
          veniam sunt in nostrud ullamco ex ullamco exercitation sint eiusmod
          proident dolore fugiat.Et ex Lorem aute laborum quis reprehenderit
          quis.Ullamco sit aliqua nostrud eu ullamco eiusmod ex et.
        </div>
      </div>
    </main>
  );
};
export default Dashboard;
