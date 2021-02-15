import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_COURSE_DATA } from '../../../api/queries/getCourseData';
import AvatarOrInitials from '../../../components/Initials/AvatarOrInitials';
import SpinnerElement from '../../../components/Spinner/spinner';
const AssignLecturerToCourse = () => {
  const { courseID } = useParams();
  const { data, loading, error } = useQuery(GET_COURSE_DATA, {
    variables: {
      id: courseID,
    },
  });
  console.log(
    `🚀 ~ file: AssignLecturerToCourse.js ~ line 8 ~ AssignLecturerToCourse ~ data`,
    data
  );

  if (loading)
    return (
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    );
  if (error) return `Error! ${error.message}`;
  const {
    CourseAvatar,
    CourseID,
    CourseNameInArabic,
    CourseNameInEnglish,
    academic_years,
    terms,
    users,
  } = data?.course;
  return (
    <main id='assign-lecturers-to-courses-page'>
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
          <span>{academic_years[0]?.AcademicYearInEnglish || ''}</span>
          <span>{CourseID}</span>
        </div>
      </header>
    </main>
  );
};

export default AssignLecturerToCourse;
