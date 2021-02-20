import { useParams } from 'react-router-dom';
import { GET_COURSE_DATA } from '../../../api/queries/getCourseData';
import AvatarOrInitials from '../../../components/Initials/AvatarOrInitials';
import Query from '../../../components/Query';
const AssignLecturerToCourse = () => {
  const { courseID } = useParams();

  return (
    <main id='assign-lecturers-to-courses-page'>
      <Query query={GET_COURSE_DATA} variables={{ id: courseID }}>
        {({ data }) => {
          const {
            CourseAvatar,
            CourseNameInEnglish,
            CourseNameInArabic,
            academic_years,
            CourseID,
            users,
          } = data?.course;
          return (
            <header className='course-assign-header'>
              <AvatarOrInitials
                {...{
                  url: CourseAvatar?.url,
                  name: CourseNameInEnglish,
                  alt: 'course-img',
                  className: 'course-img-avatar',
                }}
              />
              <div>
                <h6>{CourseNameInEnglish}</h6>
                <span>
                  {(academic_years &&
                    academic_years[0]?.AcademicYearInEnglish) ||
                    ''}
                </span>
                <span>{CourseID}</span>
              </div>
            </header>
          );
        }}
      </Query>
    </main>
  );
};

export default AssignLecturerToCourse;
