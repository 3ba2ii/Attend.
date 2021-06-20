import { GET_COURSE_DATA } from 'api/queries/getCourseData';
import { GET_COURSE_STUDENTS_ATTENDANCE_RATES } from 'api/queries/getCourseStudentsAttendanceRates';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import { formatDistance, format } from 'date-fns';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  computeGrowth,
  computeOverallAttendanceRate,
} from 'utlis/helpers/computeAttendance';
import './course-page.css';

export const CoursePage = () => {
  const { courseID } = useParams();
  const [students, setStudents] = useState({});
  const [studentsSection, setStudentsSection] = useState({});

  const [processedLectures, setProcessedLectures] = useState({});
  const [processedSections, setProcessedSections] = useState({});

  console.log(
    `🚀 ~ file: CoursePage.js ~ line 15 ~ CoursePage ~ processedLectures`,
    processedSections
  );

  const onDataFetched = ({
    course: {
      academic_year: { groups },
    },
    lectures,
    sections,
  }) => {
    try {
      let studentsLectureAttendanceCount = {};
      let studentsSectionAttendanceCount = {};

      groups.forEach(({ students }) =>
        students.forEach(({ id }) => {
          studentsLectureAttendanceCount[id] = 0;
          studentsSectionAttendanceCount[id] = 0;
        })
      );

      let lecturesCountSet = {};
      lectures.forEach(({ attendances, LectureNumber, ...rest }) => {
        if (lecturesCountSet.hasOwnProperty(LectureNumber)) {
          lecturesCountSet[LectureNumber].attendances =
            lecturesCountSet[LectureNumber].attendances.concat(attendances);
        } else {
          lecturesCountSet[LectureNumber] = {
            attendances,
            ...rest,
            LectureNumber,
          };
        }
        attendances.forEach(({ student: { id } }) => {
          studentsLectureAttendanceCount[id] += 1;
        });
      });

      //Same Process but for sections
      let sectionsCountSet = {};
      sections.forEach(({ attendances, SectionNumber, ...rest }) => {
        if (sectionsCountSet.hasOwnProperty(SectionNumber)) {
          sectionsCountSet[SectionNumber].attendances =
            sectionsCountSet[SectionNumber].attendances.concat(attendances);
        } else {
          sectionsCountSet[SectionNumber] = {
            attendances,
            ...rest,
            SectionNumber,
          };
        }
        attendances.forEach(({ student: { id } }) => {
          studentsSectionAttendanceCount[id] += 1;
        });
      });

      setProcessedLectures(lecturesCountSet);
      setStudents(studentsLectureAttendanceCount);
      setStudentsSection(studentsSectionAttendanceCount);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <main id='main-course-page'>
      <Query query={GET_COURSE_DATA} variables={{ id: courseID }}>
        {({ data: { course } }) => {
          const { CourseAvatar, CourseNameInEnglish, academic_year, CourseID } =
            course;

          const {
            AcademicYearInEnglish,
            department: { DepartmentNameInEnglish },
          } = academic_year;
          return (
            <section className='course-header-section'>
              <header>
                <AvatarOrInitials
                  {...{
                    url: CourseAvatar?.url,
                    name: CourseNameInEnglish,
                    alt: 'course-img',
                    className: 'course-img-avatar',
                  }}
                />
                <div className='course-card-name-info'>
                  <h5>{CourseNameInEnglish}</h5>
                  <span>
                    {(academic_year && AcademicYearInEnglish) || ''} -{' '}
                    {DepartmentNameInEnglish}
                  </span>
                  <span>{CourseID}</span>
                </div>
              </header>
              <aside>
                <div className='buttons-container-flex'>
                  <button className='btn-with-icon'>
                    <div className='icons8-user-add'></div>
                    <span>Manual Assign</span>
                  </button>
                  <button className='btn-with-icon'>
                    <div className='icons8-share-rounded'></div>
                    <span>Export Reports</span>
                  </button>
                </div>
                <button className='btn-with-icon course-settings-btn'>
                  <div className='icons8-tune'></div>
                  <span>View Settings</span>
                </button>
              </aside>
            </section>
          );
        }}
      </Query>
      <Query
        query={GET_COURSE_STUDENTS_ATTENDANCE_RATES}
        onCompletedFunction={onDataFetched}
        variables={{
          id: courseID,
        }}
      >
        {({ data: { lectures: dataLectures, sections } }) => {
          const { LectureDateTime } = dataLectures[0];
          const { SectionDateTime } = sections[0];
          const studentsLength = Object.keys(students).length;
          const growth = computeGrowth({
            lectures: Object.values(processedLectures),
            studentsLength,
          });

          return (
            <section id='course-statics-cards-section'>
              <div className='statistics-card-container total-lectures-card'>
                <header>
                  <h6>Total Lectures</h6>
                  <span></span>
                </header>
                <aside>
                  <h3>{dataLectures.length}</h3>
                  <span>
                    Last Lecture:
                    {LectureDateTime
                      ? ' ' +
                        format(new Date(LectureDateTime), 'dd. MMMM. yyyy')
                      : ''}
                    <br />
                    {LectureDateTime
                      ? formatDistance(new Date(LectureDateTime), new Date(), {
                          addSuffix: true,
                        })
                      : 'No lecture yet'}
                  </span>
                </aside>
              </div>
              <div className='statistics-card-container overall-attendance-card'>
                <header>
                  <h6>Tot. Attendance</h6>
                </header>
                <aside>
                  <h3>
                    {dataLectures.length
                      ? computeOverallAttendanceRate({
                          lectures: Object.values(processedLectures),
                          studentsLength,
                        }) + '%'
                      : 'No lectures yet'}
                  </h3>

                  <span className='growth'>
                    {growth >= 0 ? (
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8.06302 8.74972C8.18671 8.87789 8.35447 8.94991 8.52941 8.94994H8.91597C9.09091 8.94991 9.25867 8.87789 9.38235 8.74972L12.4874 5.53319L14 7.10011V3H10.042L11.5546 4.56693L8.72269 7.50056L6.74369 5.4505C6.62001 5.32234 6.45225 5.25032 6.27731 5.25028H5.89075C5.71581 5.25032 5.54805 5.32234 5.42437 5.4505L1 10.0337L1.93276 11L6.08403 6.69967L8.06302 8.74972Z'
                          fill='#31C977'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8.06302 5.25028C8.1867 5.12211 8.35447 5.05009 8.52941 5.05006H8.91597C9.09091 5.05009 9.25867 5.12211 9.38235 5.25028L12.4874 8.46681L14 6.89989V11H10.042L11.5546 9.43307L8.72269 6.49944L6.74369 8.5495C6.62001 8.67766 6.45225 8.74968 6.27731 8.74972H5.89075C5.71581 8.74968 5.54805 8.67766 5.42437 8.5495L1 3.96626L1.93276 3L6.08403 7.30033L8.06302 5.25028Z'
                          fill='#E47C67'
                        />
                      </svg>
                    )}

                    <span
                      className={`${
                        growth >= 0 ? 'positive-growth' : 'negative-growth'
                      } `}
                    >
                      {growth + '% vs last lecture'}
                    </span>
                  </span>
                </aside>
              </div>
              <div className='statistics-card-container'>
                <header>
                  <h6>Total Sections</h6>
                </header>
                <aside>
                  <h3>{sections.length}</h3>

                  <span>
                    Last Section :
                    {SectionDateTime
                      ? ' ' +
                        format(new Date(SectionDateTime), 'dd. MMMM. yyyy')
                      : ''}
                    <br />
                    {SectionDateTime
                      ? formatDistance(new Date(SectionDateTime), new Date(), {
                          addSuffix: true,
                        })
                      : 'No sections yet'}
                  </span>
                </aside>
              </div>
              <div className='statistics-card-container'>
                <header>
                  <h6>Total Lectures</h6>
                </header>
                <aside>
                  <h3>{dataLectures.length}</h3>

                  <span>
                    Last Lecture : 20.11.2021
                    <br />3 days ago
                  </span>
                </aside>
              </div>
            </section>
          );
        }}
      </Query>
    </main>
  );
};
