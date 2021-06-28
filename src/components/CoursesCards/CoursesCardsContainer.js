import { Link } from 'react-router-dom';
import 'pages/DataEntry/AssignLectures/assign-lecturers.css';
const CoursesCardsContainer = ({ courses, path }) => {
  const coursePath = path ? path : '/admin_panel/admin_courses';
  return (
    <ul className='courses-card-grid-container'>
      {courses.map(
        ({ CourseID, CourseNameInEnglish, CourseAvatar, id }, index) => {
          return (
            <Link to={`${coursePath}/${id}`} key={id}>
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
