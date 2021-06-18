import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { GET_COURSE_DATA } from 'api/queries/getCourseData';
import { GET_COURSE_STUDENTS_ATTENDANCE_RATES } from 'api/queries/getCourseStudentsAttendanceRates';
import downloadReportSVG from 'assets/downloadReport.svg';
import manualAssignSVG from 'assets/manualAssignment.svg';
import topStudentsSVG from 'assets/TopStudents.svg';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { transitionFormatModalStyle } from 'types/styles';
import './admin-course-page.css';
import { AttendancePerLectureChart } from './AttendancePerLectureChart';
import { SettingsModal } from './CourseSettingsModal';
import { CourseStaticsInfo } from './CourseStaticsInfoCards';
import { DoughnutChart } from '../../../components/Charts/DoughnutChart';

const CoursePage = () => {
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
  const [openModal, setOpenModal] = useState('');

  const onDataFetched = ({
    course: {
      academic_year: { groups },
    },
    lectures,
  }) => {
    try {
      let studentsArr = {};
      groups.forEach(({ students }) =>
        students.forEach(({ id }) => {
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
    document.title = 'Attend. | Course Page';

    let finalResults = {
      'Below 20%': 0,
      '20% - 40%': 0,
      '40% - 60%': 0,
      '60% - 80%': 0,
      'Above 80%': 0,
    };
    for (const [, value] of Object.entries(students)) {
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
              <button
                className='course-settings'
                onClick={() => {
                  setOpenModal('settings-modal');
                }}
              >
                Edit Settings
              </button>
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
                              key={actionTitle + actionSubtitle + index}
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
                      <DoughnutChart
                        labelsDataSet={labelsDataSet}
                        lectures={lectures}
                        studentsLength={Object.keys(students).length}
                        options={DoughnutChartOptions}
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
                        setOpenModal={setOpenModal}
                      />
                    </ul>
                    <TransitionalModalChildren
                      {...{
                        open: Boolean(openModal === 'lectures-modal'),
                        handleClose: () => {
                          setOpenModal('');
                        },
                      }}
                    >
                      <LecturesDeletionModal lectures={lectures} />
                    </TransitionalModalChildren>
                  </section>
                );
              }}
            </Query>
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
          </main>
        );
      }}
    </Query>
  );
};

const LecturesDeletionModal = ({ lectures }) => {
  console.log(
    `🚀 ~ file: CoursePage.js ~ line 234 ~ LecturesDeletionModal ~ lectures`,
    lectures
  );
  return <section className='manipulate-lecturer-container'>Hello</section>;
};
const TransitionalModalChildren = ({ open, handleClose, children }) => {
  const classes = transitionFormatModalStyle();

  return (
    <Modal
      aria-labelledby='How to format the excel file?'
      aria-describedby='Excel file formation'
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>{children}</div>
      </Fade>
    </Modal>
  );
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

const DoughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  responsiveAnimationDuration: 0,

  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 0,
    },
  },

  legend: {
    align: 'end',
    position: 'right',

    labels: {
      fontSize: 14,
      usePointStyle: true,
      boxWidth: 7,
    },
  },
  tooltips: {
    position: 'average',

    backgroundColor: '#344D6D',
    callbacks: {
      label: function (tooltipItem, data) {
        return (
          ' Att. Rate: ' +
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
export default CoursePage;
