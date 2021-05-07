import { GET_COURSE_DATA } from 'api/queries/getCourseData';
import { GET_COURSE_STUDENTS_ATTENDANCE_RATES } from 'api/queries/getCourseStudentsAttendanceRates';
import downloadReportSVG from 'assets/downloadReport.svg';
import manualAssignSVG from 'assets/manualAssignment.svg';
import topStudentsSVG from 'assets/TopStudents.svg';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './admin-course-page.css';
import { AttendancePerLectureChart } from './AttendancePerLectureChart';
import { CourseStudentsWithAttendancePercentageChart } from './CourseStudentsWithAttendancePercentageChart';
import gradSVG from 'assets/grad.svg';
import overallStatics from 'assets/overall-statics.svg';
import { formatDistance } from 'date-fns';

const AssignLecturerToCourse = () => {
  const { courseID } = useParams();
  const [students, setStudents] = useState({});
  const [lecturesCount, setLecturesCount] = useState(0);
  const [labelsDataSet, setLabelDataSet] = useState({
    'Below 20%': 0,
    '20% - 40%': 0,
    '40% - 60%': 0,
    '60% - 80%': 0,
    'Above 80%': 0,
  });

  const onDataFetched = ({
    course: {
      academic_year: { groups },
    },
    lectures,
  }) => {
    try {
      let studentsArr = {};
      groups.forEach(({ students }) =>
        students.map(({ id }) => {
          studentsArr[id] = 0;
        })
      );

      let lecturesCountSet = new Set([]);

      lectures.forEach(({ attendances, LectureNumber }) => {
        lecturesCountSet.add(LectureNumber);
        attendances.forEach(({ student: { id } }) => {
          studentsArr[id] += 1;
        });
      });

      const count = lecturesCountSet.size;
      setLecturesCount(count);
      setStudents(studentsArr);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    let finalResults = {
      'Below 20%': 0,
      '20% - 40%': 0,
      '40% - 60%': 0,
      '60% - 80%': 0,
      'Above 80%': 0,
    };
    for (const [key, value] of Object.entries(students)) {
      const percentage = ((Number(value) / lecturesCount) * 100).toFixed();

      if (percentage > 80) {
        finalResults['Above 80%'] += 1;
      } else if (percentage > 60 && percentage <= 80) {
        finalResults['60% - 80%'] += 1;
      } else if (percentage > 40 && percentage <= 60) {
        finalResults['40% - 60%'] += 1;
      } else if (percentage > 20 && percentage <= 40) {
        finalResults['20% - 40%'] += 1;
      } else {
        finalResults['Below 20%'] += 1;
      }
    }

    setLabelDataSet(finalResults);
  }, [students, lecturesCount]);

  return (
    <Query query={GET_COURSE_DATA} variables={{ id: courseID }}>
      {({ data: { course } }) => {
        const {
          CourseAvatar,
          CourseNameInEnglish,
          academic_year,
          CourseID,
          users,
        } = course;

        const {
          AcademicYearInEnglish,
          department: { DepartmentNameInEnglish },
        } = academic_year;

        return (
          <main id='assign-lecturers-to-courses-page'>
            <section className='course-assign-header'>
              <header className='course-name-with-info'>
                <AvatarOrInitials
                  {...{
                    url: CourseAvatar?.url,
                    name: CourseNameInEnglish,
                    alt: 'course-img',
                    className: 'course-img-avatar',
                  }}
                />
                <div className='course-details-info'>
                  <h4>{CourseNameInEnglish}</h4>
                  <span>
                    {(academic_year && AcademicYearInEnglish) || ''} -{' '}
                    {DepartmentNameInEnglish}
                  </span>
                  <span>{CourseID}</span>
                </div>
              </header>
              <div className='course-settings'>
                <span className='icons8-settings-course'></span>
              </div>
            </section>

            <Query
              query={GET_COURSE_STUDENTS_ATTENDANCE_RATES}
              onCompletedFunction={onDataFetched}
              variables={{
                id: courseID,
              }}
            >
              {({ data: { lectures } }) => {
                return (
                  <section className='course-info-grid-container'>
                    <ul className='actions-container'>
                      {courseActionsInfo.map(
                        (
                          { actionIcon, actionSubtitle, actionTitle },
                          index
                        ) => {
                          return (
                            <li
                              key={actionTitle + index}
                              className='single-action-card'
                            >
                              <div className='action-img-container'>
                                {actionIcon}
                              </div>
                              <header className='action-header-container'>
                                <span>{actionTitle}</span>
                                <p>{actionSubtitle}</p>
                              </header>
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <div className='students-with-rates-chart'>
                      <CourseStudentsWithAttendancePercentageChart
                        labelsDataSet={labelsDataSet}
                        lectures={lectures}
                        studentsLength={Object.keys(students).length}
                      />
                    </div>

                    <div className='attendance-per-lecture-chart'>
                      <AttendancePerLectureChart
                        lectures={lectures}
                        studentsLength={Object.keys(students).length}
                      />
                    </div>

                    <ul className='statistical-charts-data'>
                      <CourseStaticsInfo
                        lectures={lectures}
                        studentsLength={Object.keys(students).length}
                        users={users}
                      />
                    </ul>
                  </section>
                );
              }}
            </Query>
          </main>
        );
      }}
    </Query>
  );
};

export default AssignLecturerToCourse;

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

const CourseStaticsInfo = ({ lectures, studentsLength, users }) => {
  try {
    const courseStaticsInfo = [
      {
        infoImg: <img src={gradSVG} alt='Lectures' />,
        infoTitle: 'Lectures',
        infoData: lectures.length,
        infoDataText: (
          <>
            Last Lecture:{' '}
            {new Date(
              lectures[lectures?.length - 1]?.LectureDateTime
            )?.toLocaleDateString()}{' '}
            <br />{' '}
            {formatDistance(
              new Date(lectures[lectures?.length - 1]?.LectureDateTime),
              new Date(),
              { addSuffix: true }
            )}
          </>
        ),
      },
      {
        infoImg: <img src={overallStatics} alt='Overall Attendance' />,
        infoTitle: 'Tot. Attendance',
        infoData: `${computeOverAllAttendance({ lectures, studentsLength })}%`,
        infoDataText: `With a total of ${lectures.length} lectures`,
      },
      {
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
              .filter((u) => ['Super Admin', 'Lecturer'].includes(u.role.name))
              .map(({ avatar, LecturerNameInEnglish }) => (
                <AvatarOrInitials
                  url={avatar.url}
                  name={LecturerNameInEnglish}
                  className='small-card-avatars'
                />
              ))}
          </div>
        ),
      },
      {
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
              .filter((u) => ['Teacher Assistant'].includes(u.role.name))
              .map(({ avatar, LecturerNameInEnglish }) => (
                <AvatarOrInitials
                  url={avatar.url}
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
          ({ infoImg, infoTitle, infoData, infoDataText }) => (
            <li key={infoTitle} className='single-statics-card'>
              <div className='img-with-title-container'>
                <div className='img-container'>{infoImg}</div>
                <h6>{infoTitle}</h6>
              </div>
              <header>
                <h3>{infoData}</h3>
                <p>{infoDataText}</p>
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
const courseActionsInfo = [
  {
    actionIcon: <img src={downloadReportSVG} alt='downloadReport' />,
    actionTitle: 'Download Reports',
    actionSubtitle:
      'Make attendance reports for this course with various types',
  },
  {
    actionIcon: <img src={manualAssignSVG} alt='manual-assignment' />,
    actionTitle: 'Manual Assignment',
    actionSubtitle: 'Assign students with missing IDs to a lecture or section',
  },
  {
    actionIcon: <img src={topStudentsSVG} alt='top-students' />,
    actionTitle: 'Top Students',
    actionSubtitle: 'Students with the highest attendance rates',
  },
];
