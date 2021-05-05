import {
  GET_COUNTS_FOR_DASHBOARD,
  GET_TOP_USERS_PER_LECTURES,
} from 'api/queries/getStaticsDataForDashbaord';
import ai from 'assets/ai.png';
import circuits from 'assets/circuits.png';
import patternRecognition from 'assets/courseImg.png';
import departmentSVG from 'assets/department.svg';
import gradSVG from 'assets/grad.svg';
import mc from 'assets/mc.png';
import taSVG from 'assets/ta.svg';
import studentSVG from 'assets/user.svg';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import React, { useEffect } from 'react';
import { getFullName } from 'utlis/helpers/getFullName';
import './admin-dashboard.css';
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
    courseAttendance: 75,
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
  useEffect(() => {
    document.title = 'Attend. | Dashboard';
  }, []);
  return (
    <main id='dashboard-container'>
      <header className='page-name'>
        <h3>Dashboard and Statistics 📈</h3>
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

        <div className='overall-attendance-rate-card-container'>test</div>
      </div>
    </main>
  );
};
export default Dashboard;

export const AdminDashboard = () => {
  useEffect(() => {
    document.title = 'Attend. | Admin Dashboard';
  }, []);
  return (
    <main id='dashboard-container'>
      <header className='page-name'>
        <h3>Dashboard and Statistics 📈</h3>
      </header>

      <section className='admin-dashboard-content-grid'>
        <section className='statics-card-container'>
          <StaticsCardsContainer />
        </section>
        <section className='top-content-container'>
          <TopUsersComponent />
        </section>
        <section className='chart-container'>
          <p>
            Sit id ea aliquip pariatur id in eiusmod. Voluptate ea labore labore
            labore dolor consectetur ipsum proident aute occaecat. Proident
            pariatur sint mollit ipsum occaecat aute aute consectetur ut irure
            voluptate duis id. Tempor non ex excepteur velit eu sunt amet aliqua
            commodo in aute fugiat esse.
          </p>
        </section>
      </section>
    </main>
  );
};
function StaticsCardsContainer() {
  return (
    <Query query={GET_COUNTS_FOR_DASHBOARD}>
      {({
        data: {
          studentsCount,
          rolesConnection: { values },
          lecturesConnection: {
            aggregate: { count },
          },
          sectionsConnection: {
            aggregate: { count: sectionsCount },
          },
        },
      }) => {
        return (
          <>
            <div className='single-admin-card-container'>
              <header>
                <h6>{studentsCount}</h6>
                <span>Students</span>
              </header>
              <aside>
                <img src={gradSVG} alt='student' />
              </aside>
            </div>
            <div className='single-admin-card-container'>
              <header>
                <h6>
                  {values.find((v) => v.name === 'Lecturer')?.users?.length ||
                    0}
                </h6>
                <span>Lecturers</span>
              </header>
              <aside>
                <img src={studentSVG} alt='lecturer' />
              </aside>
            </div>
            <div className='single-admin-card-container'>
              <header>
                <h6>
                  {values.find((v) => v.name === 'Teacher Assistant')?.users
                    ?.length || 0}
                </h6>
                <span>TA's</span>
              </header>
              <aside>
                <img src={taSVG} alt='teacher assistant' />
              </aside>
            </div>
            <div className='single-admin-card-container'>
              <header>
                <h6>{count}</h6>
                <span>Lectures</span>
              </header>
              <aside>
                <img src={departmentSVG} alt='department' />
              </aside>
            </div>
            <div className='single-admin-card-container'>
              <header>
                <h6>{sectionsCount}</h6>
                <span>Sections</span>
              </header>
              <aside>
                <img src={departmentSVG} alt='department' />
              </aside>
            </div>
          </>
        );
      }}
    </Query>
  );
}

const TopUsersComponent = () => {
  return (
    <Query query={GET_TOP_USERS_PER_LECTURES}>
      {({ data: { users } }) => {
        console.log(
          `🚀 ~ file: Dashboard.js ~ line 207 ~ TopUsersComponent ~ data`,
          users[0].lectures.length
        );

        const topLecturerUsers = users.slice().sort((a, b) => {
          return b.lectures.length - a.lectures.length;
        });
        console.log(
          `🚀 ~ file: Dashboard.js ~ line 218 ~ topLecturerUsers ~ topLecturerUsers`,
          topLecturerUsers
        );

        return (
          <section className='top-users-list-container'>
            <header>
              <h6>Top Lecturers</h6>
              <aside>View All</aside>
            </header>
            <ul>
              {topLecturerUsers.map(
                ({ avatar, LecturerNameInEnglish, lectures, username }) => {
                  return (
                    <li key={username} className='single-user-container'>
                      <div className='avatar-user-container'>
                        <div className='avatar-container'>
                          <AvatarOrInitials
                            url={avatar?.url}
                            name={LecturerNameInEnglish}
                            className='top-user-avatar'
                          />
                        </div>
                        <header>
                          <span className='font-weight600'>
                            {getFullName(LecturerNameInEnglish)}
                          </span>
                          <span>{username}</span>
                        </header>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </section>
        );
      }}
    </Query>
  );
};
