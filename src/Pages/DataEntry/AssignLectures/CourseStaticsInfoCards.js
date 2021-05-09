import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import React from 'react';
import gradSVG from 'assets/grad.svg';
import overallStatics from 'assets/overall-statics.svg';
import { formatDistance } from 'date-fns';

const computeOverAllAttendance = ({ lectures, studentsLength }) => {
  try {
    const count = lectures.length;
    let result = 0;
    lectures.forEach(({ attendances }) => {
      result += (attendances.length / studentsLength) * 100;
    });
    return (result / count).toFixed(0);
  } catch (e) {
    console.error(e.message);
    return 0;
  }
};
export const CourseStaticsInfo = ({ lectures, studentsLength, users }) => {
  try {
    const courseStaticsInfo = [
      {
        id: 'lectures-card',
        infoImg: <img src={gradSVG} alt='Lectures' />,
        infoTitle: 'Lectures',
        infoData: lectures.length,
        infoDataText: (
          <>
            {lectures.length
              ? ' Last Lecture: ' +
                new Date(
                  lectures[lectures?.length - 1]?.LectureDateTime
                )?.toLocaleDateString()
              : ''}{' '}
            <br />{' '}
            {lectures.length
              ? formatDistance(
                  new Date(lectures[lectures?.length - 1]?.LectureDateTime),
                  new Date(),
                  { addSuffix: true }
                )
              : 'No lecture yet'}
          </>
        ),
      },
      {
        id: 'overall-attendance-card',

        infoImg: <img src={overallStatics} alt='Overall Attendance' />,
        infoTitle: 'Tot. Attendance',
        infoData: `${
          lectures.length &&
          computeOverAllAttendance({ lectures, studentsLength }) + '%'
        }`,
        infoDataText: `${
          lectures.length
            ? `With a total of ${lectures.length} lectures`
            : 'No lectures yet'
        }`,
      },
      {
        id: 'lecturers-count-card',

        infoImg: <img src={overallStatics} alt='Lecturers' />,
        infoTitle: 'Lecturers',
        infoData: (
          <span>
            {' '}
            {
              users.filter((u) =>
                ['Super Admin', 'Lecturer'].includes(u.role.name)
              ).length
            }
            <p style={{ margin: '6px 0px' }}>Lecturers</p>
          </span>
        ),
        infoDataText: (
          <div className='users-images-container'>
            {users
              .filter((u) =>
                ['Super Admin', 'Lecturer'].includes(u?.role?.name)
              )
              .map(({ avatar, LecturerNameInEnglish, index }) => (
                <AvatarOrInitials
                  key={LecturerNameInEnglish + index}
                  url={avatar?.url}
                  name={LecturerNameInEnglish}
                  className='small-card-avatars'
                />
              ))}
          </div>
        ),
      },
      {
        id: 'tas-count-card',
        infoImg: <img src={overallStatics} alt='TAs' />,
        infoTitle: 'TAs',
        infoData: (
          <span>
            {' '}
            {
              users.filter((u) => ['Teacher Assistant'].includes(u.role.name))
                .length
            }
            <p style={{ margin: '6px 0px' }}>TAs</p>
          </span>
        ),
        infoDataText: (
          <div className='users-images-container'>
            {users
              .filter((u) => ['Teacher Assistant'].includes(u?.role?.name))
              .map(({ avatar, LecturerNameInEnglish }, index) => (
                <AvatarOrInitials
                  key={LecturerNameInEnglish + index}
                  url={avatar?.url}
                  name={LecturerNameInEnglish}
                  className='small-card-avatars'
                />
              ))}
          </div>
        ),
      },
    ];
    return (
      <>
        {courseStaticsInfo.map(
          ({ id, infoImg, infoTitle, infoData, infoDataText }, index) => (
            <li key={id + index} className='single-statics-card'>
              <div className='img-with-title-container'>
                <div className='img-container'>{infoImg}</div>
                <h6>{infoTitle}</h6>
              </div>
              <header>
                <h3>{infoData}</h3>
                <aside className='info-data-text'>{infoDataText}</aside>
              </header>
            </li>
          )
        )}
      </>
    );
  } catch (e) {
    console.error(e.message);
    return <div>No data found</div>;
  }
};
