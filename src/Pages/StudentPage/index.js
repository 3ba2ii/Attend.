import {
  GET_STUDENT_ATTENDANCES,
  GET_STUDENT_INFO,
} from 'api/mutations/getStudentInfo';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import { format, formatDistance } from 'date-fns';
import {
  AvgAttendanceComponent,
  MeetingStaticCard,
} from 'pages/CoursePage/CoursePage';
import { groupDataByDate } from 'pages/MyProfilePage/ProfilePage';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ContentLoader from 'react-content-loader';
import Chart from 'react-google-charts';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { groupDataByMonths } from 'utlis/helpers/groupDataByMonths.js';
import './student-page.css';
import { StudentExportMenu } from './StudentExportReportMenu';

const defaultStudent = {
  id: null,
  NationalID: null,
  StudentNameInArabic: null,
  StudentOfficialEmail: null,
  group: null,
};

export const StudentPage = () => {
  const { studentID } = useParams();
  const [studentCourseInfo, setStudentCourseInfo] = useState({});

  const [openExportMenu, setOpenExportMenu] = useState(false);

  const [studentPersonalInfo, setStudentPersonalInfo] = useState({});

  const [studentMeetings, setStudentMeetings] = useState({
    Lecture: [],
    Section: [],
  });

  const onUserPersonalInfoFetched = ({ student }) => {
    setStudentPersonalInfo(student);
  };
  /* let checkingOnly = {}; */
  const onStudentAttendanceFetched = ({ student }) => {
    try {
      const { group, attendances } = student;
      attendances.forEach(({ lecture, section, id }) => {
        /* const meetingNumber = lecture?.LectureNumber || section?.SectionNumber;
        const courseName =
          lecture?.course?.CourseNameInEnglish ||
          section?.course?.CourseNameInEnglish; */
        /*    if (checkingOnly.hasOwnProperty(courseName)) {
          checkingOnly[courseName].push(meetingNumber);
        } else {
          checkingOnly[courseName] = [meetingNumber];
          console.log(checkingOnly);
        }
        console.log(id, meetingNumber, courseName); */
      });
      /* console.log(checkingOnly); */

      const studentCourses = group?.academic_year?.courses;

      let studentCourseInfo = {};
      //{Engineering Mathematics : {attendedLectures:[],attendedSections:[],totalLectures:5,totalSections:4 , ...remaining_course_info}}
      studentCourses.forEach(
        ({ CourseNameInEnglish, lectures, sections, ...rest }) => {
          const uniqueLectures = new Set(lectures.map((l) => l.LectureNumber));

          const uniqueSections = new Set(sections.map((s) => s.SectionNumber));

          studentCourseInfo[CourseNameInEnglish] = {
            courseLectures: uniqueLectures,
            courseSections: uniqueSections,
            CourseNameInEnglish,
            attendedLectures: new Set([]),
            attendedSections: new Set([]),
            ...rest,
          };
        }
      );

      let studentMeetings = { Lecture: [], Section: [] };
      //now iterate over attendances and add student Data to each course
      attendances.forEach(({ section, lecture }) => {
        let meeting, meetingNumber, meetingDateTime, __typename;

        if (section) {
          meeting = section;
          meetingDateTime = section.SectionDateTime;
          meetingNumber = section.SectionNumber;
          __typename = 'Section';
        } else if (lecture) {
          meeting = lecture;

          meetingDateTime = lecture.LectureDateTime;
          meetingNumber = lecture.LectureNumber;
          __typename = 'Lecture';
        }

        const { CourseNameInEnglish } = meeting?.course;

        if (studentCourseInfo.hasOwnProperty(CourseNameInEnglish)) {
          studentCourseInfo[CourseNameInEnglish][`attended${__typename}s`].add(
            meetingNumber
          );
        }
        studentMeetings[__typename].push(meeting);
      });

      setStudentCourseInfo(studentCourseInfo);

      setStudentMeetings(studentMeetings);
    } catch (e) {
      console.error(e.message);
    }
  };
  useEffect(() => {
    document.title =
      studentPersonalInfo?.StudentNameInArabic || 'Student Account';
  }, [studentPersonalInfo]);
  return (
    <main id='student-page'>
      <Query
        query={GET_STUDENT_INFO}
        variables={{ id: studentID }}
        loadingComponent={<SnapchatThread />}
        onCompletedFunction={onUserPersonalInfoFetched}
      >
        {({ data: { student } }) => {
          const { id, StudentNameInArabic, StudentOfficialEmail, group } =
            student || defaultStudent;
          if (!id) return <h1>404 Not Found</h1>;

          const { academic_year } = group || {};
          const {
            AcademicYearInEnglish,
            department: { DepartmentNameInEnglish },
          } = academic_year;
          return (
            <section className='course-header-section'>
              <header>
                <AvatarOrInitials
                  {...{
                    name: StudentNameInArabic,
                    alt: 'course-img',
                    className: 'course-img-avatar',
                  }}
                />
                <div className='course-card-name-info'>
                  <h5>{StudentNameInArabic}</h5>
                  <span>
                    {(academic_year && AcademicYearInEnglish) || ''} -{' '}
                    {DepartmentNameInEnglish}
                  </span>
                  <span>Email: {StudentOfficialEmail}</span>
                </div>
              </header>

              <aside>
                <div className='buttons-container-flex'>
                  <button
                    className='btn-with-icon'
                    onClick={() => {
                      setOpenExportMenu(!openExportMenu);
                    }}
                  >
                    <div className='icons8-share-rounded'></div>
                    <span>Export Reports</span>
                  </button>
                </div>
                <CSSTransition
                  in={openExportMenu}
                  unmountOnExit
                  timeout={500}
                  classNames={'identifier-error'}
                >
                  <StudentExportMenu
                    studentCourseInfo={studentCourseInfo}
                    studentPersonalInfo={studentPersonalInfo}
                  />
                </CSSTransition>
              </aside>
            </section>
          );
        }}
      </Query>

      <Query
        query={GET_STUDENT_ATTENDANCES}
        variables={{ id: studentID }}
        loadingComponent={<StaticsInfoLoadingComponent />}
        onCompletedFunction={onStudentAttendanceFetched}
      >
        {() => {
          const studentCoursesValue = Object.values(studentCourseInfo) || [];

          if (studentCoursesValue.length === 0) {
            return <div></div>;
          }
          const totalAttendedLectures = studentCoursesValue.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue?.attendedLectures?.size,
            0
          );
          const totalAttendedSections = studentCoursesValue.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue?.attendedSections?.size,
            0
          );

          const sortedLectures = studentMeetings['Lecture'].sort(
            (a, b) => new Date(b.LectureDateTime) - new Date(a.LectureDateTime)
          );
          const sortedSections = studentMeetings['Section'].sort(
            (a, b) => new Date(b.SectionDateTime) - new Date(a.SectionDateTime)
          );

          const concatenatedMeetings = sortedLectures
            .concat(sortedSections)
            .sort(
              (a, b) =>
                new Date(b.LectureDateTime || b.SectionDateTime) -
                new Date(a.LectureDateTime || a.SectionDateTime)
            );

          const lastLectureDate = sortedLectures?.[0]?.LectureDateTime;
          const lastSectionDate = sortedSections?.[0]?.SectionDateTime;

          const LastLectureDateTime = lastLectureDate
            ? format(
                new Date(sortedLectures?.[0]?.LectureDateTime),
                'dd. MMMM. yyyy'
              )
            : 'No lecture yet';

          const LastLectureDistance = lastLectureDate
            ? formatDistance(new Date(lastLectureDate), new Date(), {
                addSuffix: true,
              })
            : '';

          const LastSectionDateTime = lastSectionDate
            ? format(new Date(lastSectionDate), 'dd. MMMM. yyyy')
            : 'No sections yet';

          const LastSectionDistance = lastSectionDate
            ? formatDistance(new Date(lastSectionDate), new Date(), {
                addSuffix: true,
              })
            : '';

          const [avgAttendancePerLecture, avgAttendancePerSection] =
            computeAverageAttendance({ studentData: studentCourseInfo });
          const dataPerMonth = groupDataByMonths(sortedLectures);

          const chartLectureData = groupDataPerMonthAndCourse(dataPerMonth);

          const dataByDate = groupDataByDate({ data: concatenatedMeetings });

          const displayedData = Object.entries(dataByDate).map(
            ([date, value]) => {
              const formattedDate = new Date(date);
              const resultDate = new Date(
                formattedDate.getFullYear(),
                formattedDate.getMonth(),
                formattedDate.getDay()
              );

              return [resultDate, value];
            }
          );

          const heatMapData = [
            [
              {
                type: 'date',
                id: 'Date',
              },
              {
                type: 'number',
                id: 'Won/Loss',
              },
            ],
            ...displayedData,
          ];
          return (
            <>
              <section id='course-statics-cards-section'>
                <MeetingStaticCard
                  {...{
                    LastMeeting: LastLectureDateTime,
                    LastMeetingDistance: LastLectureDistance,
                    __typename: 'Lecture',
                    dataLength: totalAttendedLectures,
                    title: 'Total Attended Lectures',
                  }}
                />
                <AvgAttendanceComponent
                  {...{
                    data: sortedLectures,
                    avgAttendance: avgAttendancePerLecture,
                    growth: 0,
                    __typename: 'Lecture',
                  }}
                />
                <MeetingStaticCard
                  {...{
                    LastMeeting: LastSectionDateTime,
                    LastMeetingDistance: LastSectionDistance,
                    __typename: 'Section',
                    dataLength: totalAttendedSections,
                    title: 'Total Attended Sections',
                  }}
                />
                <AvgAttendanceComponent
                  {...{
                    data: sortedSections,
                    avgAttendance: avgAttendancePerSection,
                    growth: 0,
                    __typename: 'Section',
                  }}
                />
              </section>
              <section id='course-chart-2nd-row'>
                <section id='attendance-per-lecture-chart'>
                  <h6>Monthly Courses Attendance</h6>
                  <MonthlyCourseAttendances
                    selectedData={chartLectureData}
                    courses={studentCoursesValue.map(
                      (c) => c.CourseNameInEnglish
                    )}
                  />
                </section>
                <ul id='activities-chart'>
                  <h6>Latest Activities</h6>
                  <StudentActivities
                    concatenatedMeetings={concatenatedMeetings}
                    studentPersonalInfo={studentPersonalInfo}
                  />
                </ul>
              </section>

              <section id='third-row-section'>
                <section
                  className='page-card-section'
                  id='user-calendar-chart-section'
                >
                  <h5>Attendance Heatmap</h5>
                  <span>{`Total of ${concatenatedMeetings?.length} Attendance Record`}</span>

                  <Chart
                    chartType='Calendar'
                    width='100%'
                    data={heatMapData}
                    options={{
                      calendar: {
                        cellSize: 19,
                      },
                      colorAxis: {
                        minValue: 1,
                        colors: ['#ACE7AE', '#386C3E'],
                      },
                    }}
                  />
                </section>
              </section>
            </>
          );
        }}
      </Query>
    </main>
  );
};

//{ComputerTechnology : [10,20,30,40], Mechanics : [20,30,50,60]}
const MonthlyCourseAttendances = ({ selectedData, courses }) => {
  const [displayedDataSet, setDisplayedDataSet] = useState([]);
  const data = {
    labels: Object.keys(selectedData),
    datasets: displayedDataSet,
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  useEffect(() => {
    let coursesInfo = {};
    courses.forEach((name) => {
      coursesInfo[name] = [];
    });

    Object.entries(selectedData).forEach(([_, value]) => {
      const monthCoursesNames = Object.keys(value);

      Object.keys(coursesInfo).forEach((CourseName) => {
        if (monthCoursesNames.includes(CourseName)) {
          coursesInfo[CourseName].push(value[CourseName]?.meetings.size);
        } else {
          coursesInfo[CourseName].push(0);
        }
      });
    });

    const datasets = Object.entries(coursesInfo).map(
      ([CourseNameInEnglish, dataset], index) => {
        return {
          label: CourseNameInEnglish,
          data: dataset,
          backgroundColor: dataset.map((_) => backgroundColors[index]),
          borderColor: dataset.map((_) => borderColors[index]),
          borderWidth: 1,
        };
      }
    );
    setDisplayedDataSet(datasets);
  }, []);
  return <Bar data={data} options={options} />;
};
function groupDataPerMonthAndCourse(dataPerMonth) {
  try {
    let result = {};

    Object.entries(dataPerMonth).forEach(([month, value]) => {
      result[month] = {};
      value.forEach(({ LectureNumber, SectionNumber, course }) => {
        const { CourseNameInEnglish } = course;
        if (result[month].hasOwnProperty(CourseNameInEnglish)) {
          result[month][CourseNameInEnglish].meetings.add(
            LectureNumber || SectionNumber
          );
        } else {
          result[month][CourseNameInEnglish] = {
            meetings: new Set([LectureNumber || SectionNumber]),
          };
        }
      });
    });

    return result;
  } catch (e) {
    console.error(e.message);
    return [];
  }
}
const StudentActivities = ({ concatenatedMeetings, studentPersonalInfo }) => {
  const { StudentNameInArabic } = studentPersonalInfo;
  return concatenatedMeetings.slice(0, 10).map((meeting) => {
    const {
      __typename,
      id,
      LectureNumber,
      SectionNumber,
      LectureDateTime,
      SectionDateTime,
      course: { CourseNameInEnglish },
    } = meeting;

    return (
      <li key={id} className='single-activity'>
        <header className='meeting-info'>
          <div>
            <span>{`${StudentNameInArabic}`}</span>{' '}
            <span>{`attended ${__typename.toLowerCase()} ${
              LectureNumber || SectionNumber
            } for course ${CourseNameInEnglish}`}</span>
          </div>
          <span className='meeting-date'>
            {format(
              new Date(LectureDateTime || SectionDateTime),
              'dd MMM yyyy p'
            )}
          </span>
        </header>
      </li>
    );
  });
};
function computeAverageAttendance({ studentData }) {
  let overallLecturesAttendance = 0;
  let overallSectionsAttendance = 0;

  const coursesLength = Object.keys(studentData).length;

  Object.values(studentData).forEach(
    ({
      attendedLectures,
      attendedSections,
      courseLectures,
      courseSections,
    }) => {
      let lecturePercentage = 0;
      let sectionPercentage = 0;
      if (courseLectures.size)
        lecturePercentage = (attendedLectures.size / courseLectures.size) * 100;

      if (courseSections.size)
        sectionPercentage = (attendedSections.size / courseSections.size) * 100;

      overallLecturesAttendance += lecturePercentage;
      overallSectionsAttendance += sectionPercentage;
    }
  );

  return [
    (overallLecturesAttendance / coursesLength).toFixed(1),
    (overallSectionsAttendance / coursesLength).toFixed(1),
  ];
}

const StaticsInfoLoadingComponent = (props) => (
  <ContentLoader
    speed={2}
    width={476}
    height={124}
    viewBox='0 0 476 124'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='29' y='52' rx='0' ry='0' width='177' height='70' />
    <rect x='232' y='52' rx='0' ry='0' width='177' height='70' />
    <rect x='438' y='52' rx='0' ry='0' width='177' height='70' />
  </ContentLoader>
);

const SnapchatThread = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={476}
      height={124}
      viewBox='0 0 476 124'
      backgroundColor='#f3f3f3'
      foregroundColor='#ecebeb'
      {...props}
    >
      <rect x='36' y='15' rx='5' ry='5' width='80' height='80' />
      <rect x='137' y='24' rx='0' ry='0' width='257' height='10' />
      <rect x='138' y='47' rx='0' ry='0' width='180' height='10' />
      <rect x='141' y='76' rx='0' ry='0' width='80' height='10' />
    </ContentLoader>
  );
};

const backgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];
const borderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];
