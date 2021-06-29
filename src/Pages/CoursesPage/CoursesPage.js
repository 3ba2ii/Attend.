import { GET_USER_COURSES } from 'api/queries/getUserCourses';
import CoursesCardsContainer from 'components/CoursesCards/CoursesCardsContainer';
import Query from 'components/Query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getFullName } from 'utlis/helpers/getFullName';
import './courses-page.css';

export const CoursesPage = () => {
  const {
    authedUser: { id, LecturerNameInEnglish, role },
  } = useSelector((state) => state.authReducer);
  const roleName = useMemo(
    () => (role.name !== 'Teacher Assistant' ? 'Dr.' : 'TA.'),
    []
  );
  return (
    <main id='courses-page-container'>
      <header className='courses-page-header'>
        <h3>
          Hello, {`${roleName} ${getFullName(LecturerNameInEnglish)}`} 👋{' '}
        </h3>
        <p>
          All your courses all listed below, if your desired course is not
          listed please
          <a href='mailto:attend.qrsys@gmail.com'> contact us</a>
        </p>
      </header>
      <Query query={GET_USER_COURSES} variables={{ id: id }}>
        {({
          data: {
            user: { courses },
          },
        }) => {
          console.log(
            `🚀 ~ file: CoursesPage.js ~ line 17 ~ CoursesPage ~ user`,
            courses
          );
          return (
            <div>
              <CoursesCardsContainer courses={courses} path={'/courses'} />
            </div>
          );
        }}
      </Query>
    </main>
  );
};
