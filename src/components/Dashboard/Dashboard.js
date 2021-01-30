import React from 'react';
import ai from '../../assets/ai.png';
import circuits from '../../assets/circuits.png';
import patternRecognition from '../../assets/courseImg.png';
import mc from '../../assets/mc.png';
import CourseCard from './CourseCard';
import './dashboard.css';
import DoughnutCard from './DoughnutCard';
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
    datasetValues: [20, 99, 70, 0, 70, 89, 99],
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
        <div className='doughnut-card-container card-shadow'>
          <DoughnutCard />
        </div>

        <div className='overall-attendance-rate-card-container'>
          Laboris laborum culpa excepteur labore est.Irure dolore aliquip
          cupidatat magna. Qui esse qui laboris duis quis velit aliquip ut
          excepteur ipsum. Cupidatat ex et eu sit consectetur deserunt eiusmod
          ea cupidatat labore consectetur ullamco sint eiusmod.
        </div>
      </div>
    </main>
  );
};
export default Dashboard;
