import { GET_COURSE_DATA } from 'api/queries/getCourseData';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import { useParams } from 'react-router-dom';
import downloadReportSVG from 'assets/downloadReport.svg';
import manualAssignSVG from 'assets/manualAssignment.svg';
import topStudentsSVG from 'assets/TopStudents.svg';
import './admin-course-page.css';

const AssignLecturerToCourse = () => {
  const { courseID } = useParams();

  return (
    <Query query={GET_COURSE_DATA} variables={{ id: courseID }}>
      {({ data }) => {
        console.log(
          `🚀 ~ file: AssignLecturerToCourse.js ~ line 13 ~ AssignLecturerToCourse ~ data`,
          data
        );
        const {
          CourseAvatar,
          CourseNameInEnglish,
          CourseNameInArabic,
          academic_year,
          CourseID,
          users,
        } = data?.course;

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
              <div className='courses-settings'>
                <p>Course Settings</p>
                <span className='icons8-dots-loading'></span>
              </div>
            </section>

            <section className='course-info-grid-container'>
              <ul className='actions-container'>
                {courseActionsInfo.map(
                  ({ actionIcon, actionSubtitle, actionTitle }, index) => {
                    return (
                      <li
                        key={actionTitle + index}
                        className='single-action-card'
                      >
                        <div className='action-img-container'>{actionIcon}</div>
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
                Exercitation in veniam adipisicing velit sint aute elit aute
                proident. Incididunt eiusmod cillum culpa ullamco reprehenderit
                nisi qui cillum. Fugiat incididunt aliquip sint proident
                adipisicing esse sint dolore sunt eiusmod qui velit ipsum ea.
                Velit duis irure
              </div>

              <div className='attendance-per-lecture-chart'>
                Cupidatat pariatur qui in ipsum nostrud laboris duis ut ea est
                in ullamco. Do nostrud fugiat dolore quis dolore fugiat id
                labore. Magna laboris sit ex exercitation officia dolor aliquip
                esse eu. Ipsum et non fugiat elit sint commodo cupidatat velit
                proident. Ipsum deserunt
              </div>

              <div className='statistical-charts-data'>
                <span>Action 1</span>
                <span>Action 2</span>
                <span>Action 3</span>
              </div>
            </section>
          </main>
        );
      }}
    </Query>
  );
};

export default AssignLecturerToCourse;

const CourseStudentsWithAttendancePercentageChart = ({ courseID }) => {};

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
