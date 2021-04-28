import { Link } from 'react-router-dom';

const CoursesCardsContainer = ({ courses }) => {
  return (
    <ul className='courses-card-grid-container'>
      {courses.map(
        (
          {
            CourseID,
            CourseNameInArabic,
            CourseNameInEnglish,
            CourseAvatar,
            id,
          },
          index
        ) => {
          return (
            <Link to={`/admin_panel/assign_lecturers/${id}`} key={id}>
              <li key={id + index}>
                <div className='single-course-card-container'>
                  <div className='single-course-card-img'>
                    <img src={CourseAvatar.url} alt={'course-avatar'} />
                  </div>
                  <header>
                    <h6>{CourseNameInEnglish}</h6>
                    <span>{CourseID}</span>
                  </header>
                </div>
              </li>
            </Link>
          );
        }
      )}
    </ul>
  );
};
export default CoursesCardsContainer;
