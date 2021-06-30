import { GET_COURSE_DATA } from 'api/queries/getCourseData';
import { GET_COURSE_STUDENTS_ATTENDANCE_RATES } from 'api/queries/getCourseStudentsAttendanceRates';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import { DoughnutChart } from 'components/Charts/DoughnutChart';
import Query from 'components/Query';
import { format, formatDistance } from 'date-fns';
import { AttendancePerLectureChart } from 'pages/CoursePage/AttendancePerLectureChart';
import { SettingsModal } from 'pages/DataEntry/AssignLectures/CourseSettingsModal';
import { TransitionalModalChildren } from 'pages/DataEntry/AssignLectures/TransitionalModalChildren';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import {
  computeGrowth,
  computeOverallAttendanceRate,
} from 'utlis/helpers/computeAttendance';
import { useLocation } from 'react-router-dom';

import { extractGroupsName } from '../../utlis/helpers/getGroupsName';
import './course-page.css';
import { ExportReportDropdown } from './ExportReportDropdown';
import { ManualAssignDropdown } from './ManualAssignDropdown';

export const CoursePageContext = createContext();

export const CoursePage = () => {
  const { courseID } = useParams();
  const { pathname } = useLocation();
  console.log(
    `🚀 ~ file: CoursePage.js ~ line 30 ~ CoursePage ~ pathname`,
    pathname
  );
  const [openExportMenu, setOpenExportMenu] = useState(false);
  const [openAssignStudentMenu, setOpenAssignStudentMenu] = useState(false);
  const [unprocessedLectures, setUnProcessedLectures] = useState({});
  const [unprocessedSections, setUnProcessedSections] = useState({});
  const {
    authedUser: {
      role: { name },
    },
  } = useSelector((state) => state.authReducer);
  const [studentsData, setStudentsData] = useState({});
  const [processedLectures, setProcessedLectures] = useState([]);
  const [processedSections, setProcessedSections] = useState({});
  const exportReportNode = useRef();
  const [openModal, setOpenModal] = useState('');
  const isAdmin = useMemo(() => name === 'Super Admin', [name]);

  const onDataFetched = ({
    course: {
      academic_year: { groups },
    },
    lectures,
    sections,
  }) => {
    try {
      setUnProcessedSections(sections);
      setUnProcessedLectures(lectures);
      let studentsData = {};
      groups.forEach(({ students }) =>
        students.forEach(({ id, ...rest }) => {
          studentsData[id] = {
            id,
            ...rest,
            course: {
              courseID: courseID,
              lectures: new Set([]),
              sections: new Set([]),
            },
          };
        })
      );

      //2- Iterate over lectures and increase the student attendance by one for each lecture he has attended
      let lecturesData = {};

      lectures.forEach(({ attendances, LectureNumber, groups, ...rest }) => {
        if (lecturesData.hasOwnProperty(LectureNumber)) {
          const tempAttendance = lecturesData[LectureNumber].attendances;
          const tempGroups = lecturesData[LectureNumber].groups;

          lecturesData[LectureNumber].attendances =
            tempAttendance.concat(attendances);
          lecturesData[LectureNumber].groups = tempGroups.concat(groups);
        } else {
          lecturesData[LectureNumber] = {
            LectureNumber,
            attendances,
            groups,
            ...rest,
          };
        }
        //Iterate over Lecture attendances and push to the students array
        attendances.forEach(({ student: { id } }) => {
          studentsData[id]?.course?.lectures?.add(LectureNumber);
        });
      });

      //The same procedure for sections
      let sectionsData = {};

      sections.forEach(({ attendances, SectionNumber, groups, ...rest }) => {
        if (sectionsData.hasOwnProperty(SectionNumber)) {
          const tempAttendance = sectionsData[SectionNumber].attendances;
          const tempGroups = sectionsData[SectionNumber].groups;

          sectionsData[SectionNumber].attendances =
            tempAttendance.concat(attendances);
          sectionsData[SectionNumber].groups = tempGroups.concat(groups);
        } else {
          sectionsData[SectionNumber] = {
            SectionNumber,
            attendances,
            groups,
            ...rest,
          };
        }
        //Iterate over Lecture attendances and push to the students array
        attendances.forEach(({ student: { id } }) => {
          studentsData[id]?.course?.sections?.add(SectionNumber);
        });
      });
      setStudentsData(studentsData);
      setProcessedLectures(lecturesData);
      setProcessedSections(sectionsData);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleClick = (e) => {
    if (exportReportNode?.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpenExportMenu(false);
  };

  useEffect(() => {
    document.title = 'Attend. | Course Page';
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [processedLectures]);

  if (!isAdmin && pathname.includes('/admin_panel')) {
    return <Redirect to='/404' />;
  }
  return (
    <main id='main-course-page'>
      <CoursePageContext.Provider
        value={{
          studentsData,
          processedLectures,
          processedSections,
          unprocessedLectures,
          unprocessedSections,
        }}
      >
        <Query query={GET_COURSE_DATA} variables={{ id: courseID }}>
          {({ data: { course } }) => {
            const {
              CourseAvatar,
              CourseNameInEnglish,
              academic_year,
              CourseID,
            } = course;

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
                    <button
                      className='btn-with-icon'
                      onClick={() => {
                        setOpenAssignStudentMenu(!openAssignStudentMenu);
                        setOpenExportMenu(false);
                      }}
                    >
                      <div className='icons8-user-add'></div>
                      <span>Manual Assign</span>
                    </button>
                    <button
                      className='btn-with-icon'
                      onClick={() => {
                        setOpenExportMenu(!openExportMenu);
                        setOpenAssignStudentMenu(false);
                      }}
                    >
                      <div className='icons8-share-rounded'></div>
                      <span>Export Reports</span>
                    </button>
                    <CSSTransition
                      in={openAssignStudentMenu}
                      unmountOnExit
                      timeout={500}
                      classNames={'identifier-error'}
                    >
                      <ManualAssignDropdown
                        setOpenAssignStudentMenu={setOpenAssignStudentMenu}
                      />
                    </CSSTransition>
                    <CSSTransition
                      in={openExportMenu}
                      unmountOnExit
                      timeout={500}
                      classNames={'identifier-error'}
                    >
                      <ExportReportDropdown
                        CourseNameInEnglish={CourseNameInEnglish}
                        exportReportNode={exportReportNode}
                      />
                    </CSSTransition>
                  </div>
                  <button
                    className='btn-with-icon course-settings-btn'
                    onClick={() => {
                      setOpenModal('settings-modal');
                    }}
                  >
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
            const concatenatedMeetings = dataLectures
              .concat(sections)
              .sort(
                (a, b) =>
                  new Date(b.LectureDateTime || b.SectionDateTime) -
                  new Date(a.LectureDateTime || a.SectionDateTime)
              );

            const LectureDateTime = dataLectures?.[0]?.LectureDateTime;
            const SectionDateTime = sections?.[0]?.SectionDateTime;

            const studentsLength = Object.keys(studentsData)?.length;

            const avgAttendancePerLecture = computeOverallAttendanceRate({
              data: Object.values(processedLectures),
              studentsLength,
            });
            const avgAttendancePerSection = computeOverallAttendanceRate({
              data: Object.values(processedSections),
              studentsLength,
            });
            const growth = computeGrowth({
              data: Object.values(processedLectures),
              studentsLength,
            });
            const sectionGrowth = computeGrowth({
              data: Object.values(processedSections),
              studentsLength,
            });

            const LastLectureDateTime = LectureDateTime
              ? format(new Date(LectureDateTime), 'dd. MMMM. yyyy')
              : 'No lecture yet';
            const LastLectureDistance = LectureDateTime
              ? formatDistance(new Date(LectureDateTime), new Date(), {
                  addSuffix: true,
                })
              : '';

            return (
              <>
                <section id='course-statics-cards-section'>
                  <div className='statistics-card-container total-lectures-card'>
                    <header>
                      <h6>Total Lectures</h6>
                    </header>
                    <aside>
                      <h3>{dataLectures.length}</h3>
                      <span>
                        Last Lecture: {' ' + LastLectureDateTime}
                        <br />
                        {LastLectureDistance}
                      </span>
                    </aside>
                  </div>
                  {AvgAttendance({
                    data: processedLectures,
                    avgAttendance: avgAttendancePerLecture,
                    growth,
                    __typename: 'Lecture',
                  })}
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
                          ? formatDistance(
                              new Date(SectionDateTime),
                              new Date(),
                              {
                                addSuffix: true,
                              }
                            )
                          : 'No sections yet'}
                      </span>
                    </aside>
                  </div>
                  {AvgAttendance({
                    data: processedSections,
                    avgAttendance: avgAttendancePerSection,
                    growth: sectionGrowth,
                    __typename: 'Section',
                  })}
                </section>

                <section id='course-chart-2nd-row'>
                  <section id='attendance-per-lecture-chart'>
                    <h6>Attendance Per Lecture</h6>
                    <AttendancePerLectureChart __typename={'Lecture'} />
                  </section>
                  <ul id='activities-chart'>
                    <h6>Latest Activities</h6>
                    <LatestActivitiesComponent
                      concatenatedMeetings={concatenatedMeetings}
                    />
                  </ul>
                </section>

                <section id='third-row-section'>
                  <section id='students-with-attendance-rates'>
                    <h6>Students Percentage with Attendance Rates</h6>

                    <DoughnutChart options={DoughnutChartOptions} />
                  </section>
                  <section id='attendance-per-section-chart'>
                    <h6>Attendance Per Section</h6>
                    <AttendancePerLectureChart __typename={'Section'} />
                  </section>
                </section>
              </>
            );
          }}
        </Query>
        {/* Transitional Modal Children */}
        <TransitionalModalChildren
          {...{
            open: Boolean(openModal === 'settings-modal'),
            handleClose: () => {
              setOpenModal('');
            },
          }}
        >
          <SettingsModal
            courseID={courseID}
            handleClose={() => {
              setOpenModal('');
            }}
          />
        </TransitionalModalChildren>
      </CoursePageContext.Provider>
    </main>
  );
};

const DoughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  legend: {
    align: 'center',
    position: 'right',

    labels: {
      fontSize: 16,
      usePointStyle: true,
      boxWidth: 8,
      fontColor: '#344D6D',
    },
  },
  tooltips: {
    position: 'average',

    backgroundColor: '#344D6D',
    callbacks: {
      label: function (tooltipItem, data) {
        return (
          ' Students Percentage ' +
          Number(data.datasets[0].data[tooltipItem.index]).toFixed(1) +
          '%'
        );
      },
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      },
    },
  },
};
function AvgAttendance({ data, avgAttendance, growth, __typename }) {
  return (
    <div className='statistics-card-container overall-attendance-card'>
      <header>
        <h6>
          Avg. Attendance <span>Per {__typename}</span>
        </h6>
      </header>
      <aside>
        <h3>{data ? avgAttendance + '%' : 'No lectures yet'}</h3>

        <span className='growth'>
          {growth !== 0 && growth >= 0 ? (
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
  );
}

function LatestActivitiesComponent({ concatenatedMeetings }) {
  return concatenatedMeetings.slice(0, 10).map((meeting) => {
    const {
      __typename,
      id,
      LectureNumber,
      SectionNumber,
      LectureDateTime,
      SectionDateTime,
      users_permissions_user: user,
      groups,
    } = meeting;
    const groupsName = extractGroupsName(groups.map((g) => g.GroupNumber));
    const { avatar, LecturerNameInEnglish } = user;
    const prefix = __typename === 'Section' ? 'TA. ' : 'DR. ';

    return (
      <li key={id} className='single-activity'>
        <AvatarOrInitials
          url={avatar?.url}
          name={LecturerNameInEnglish}
          className='activities-avatar'
        />
        <header className='meeting-info'>
          <div>
            <span>{`${prefix}${LecturerNameInEnglish}`}</span>{' '}
            <span>{`created ${__typename.toLowerCase()} ${
              LectureNumber || SectionNumber
            } for ${groupsName} `}</span>
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
}
