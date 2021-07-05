//create a react component
import { GET_DEPARTMENT_USERS } from 'api/queries/getDepartmentUsers';
import { GET_USER_FULLY_DETAILED_QUERY } from 'api/queries/profilePageQueries';
import defaultCoverImage from 'assets/bg.jpeg';
import { ReactComponent as EmailIcon } from 'assets/icons/email.svg';
import { ReactComponent as PhoneIcon } from 'assets/icons/phone.svg';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import { UserWithAvatarLoader } from 'components/Loaders';
import Query from 'components/Query';
import { format } from 'date-fns';
import 'pages/CoursePage/course-page.css';
import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-google-charts';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { extractGroupsName } from 'utlis/helpers/getGroupsName';
import './profile-page.css';

function getDateWithoutTime(dateTime) {
  var date = new Date(dateTime);
  date.setHours(0, 0, 0, 0);
  return date;
}
const groupDataByDate = ({ data }) => {
  let resultData = {};
  data.forEach(({ LectureDateTime, SectionDateTime }) => {
    const meetingDateOnly = new Date(
      getDateWithoutTime(LectureDateTime || SectionDateTime)
    );
    if (resultData.hasOwnProperty(meetingDateOnly))
      resultData[meetingDateOnly] += 1;
    else {
      resultData[meetingDateOnly] = 1;
    }
  });
  return resultData;
};
const defaultData = {
  id: null,
  LecturerNameInEnglish: null,
  LecturerNameInArabic: null,
  avatar: null,
  courses: null,
  department: null,
  email: null,
  lectures: null,
  sections: null,
  role: null,
  coverImage: null,
};

export const ProfilePage = () => {
  const { username } = useParams();
  const [userPreferences, setUserPreferences] = useState({
    isContactInfoPublic: false,
    isPrivateAccount: false,
    isActivitiesCoursesPublic: false,
  });
  console.log(
    `🚀 ~ file: ProfilePage.js ~ line 54 ~ ProfilePage ~ userPreferences`,
    userPreferences
  );

  const {
    authedUser: {
      id,
      username: authedUserUsername,
      role: { name },
    },
  } = useSelector((state) => state.authReducer);

  const [shuffledUsers, setShuffledUsers] = useState([]);

  const isAdmin = useMemo(() => name === 'Super Admin', [name]);

  const isAuthedUserProfile = useMemo(
    () => username.toLowerCase() === authedUserUsername.toLowerCase(),
    [username, authedUserUsername]
  );

  const isContactInfoVisible = useMemo(() => {
    if (isAdmin || isAuthedUserProfile || userPreferences.isContactInfoPublic)
      return true;
    return false;
  }, [isAdmin, isAuthedUserProfile, userPreferences.isContactInfoPublic]);

  const isPrivateAccount = useMemo(() => {
    if (isAdmin || isAuthedUserProfile || !userPreferences.isPrivateAccount)
      return true;
    return false;
  }, [isAdmin, isAuthedUserProfile, userPreferences.isPrivateAccount]);

  const isActivitiesCoursesPublic = useMemo(() => {
    if (
      isAdmin ||
      isAuthedUserProfile ||
      userPreferences.isActivitiesCoursesPublic
    )
      return true;
    return false;
  }, [isAdmin, isAuthedUserProfile, userPreferences.isActivitiesCoursesPublic]);

  const onFetchingUsers = ({ department }) => {
    const { users } = department || {};
    const usersWithoutCurrentUser = users.filter(
      (user) => user.username !== username
    );
    const shuffledArray = shuffle(usersWithoutCurrentUser);
    setShuffledUsers(shuffledArray);
  };

  const onFetchUserData = ({ users }) => {
    const {
      LecturerNameInEnglish,
      isContactInfoPublic,
      isPrivateAccount,
      isActivitiesCoursesPublic,
    } = users?.[0] || defaultData;
    document.title = LecturerNameInEnglish;

    setUserPreferences({
      isContactInfoPublic,
      isPrivateAccount,
      isActivitiesCoursesPublic,
    });
  };
  useEffect(() => {
    document.title = 'Profile';
  }, []);

  if (!username) return <h1>404 Not Found</h1>;

  return (
    <Query
      query={GET_USER_FULLY_DETAILED_QUERY}
      variables={{ username: username || '' }}
      onCompletedFunction={onFetchUserData}
    >
      {({ data: { users } }) => {
        const {
          id,
          LecturerNameInEnglish,
          avatar,
          department,
          email,
          lectures,
          sections,
          role,
          coverImage,
          PhoneNumber,
        } = users?.[0] || defaultData;

        if (!id) return <h1>404 Error Not Found</h1>;
        const { name } = role || {};
        const __typename = name !== 'Teacher Assistant' ? 'Lecture' : 'Section';
        const selectedMeetings =
          name !== 'Teacher Assistant' ? lectures : sections;
        const meetingsPerCourse = groupMeetingsByCourseID(selectedMeetings);
        const dataByDate = groupDataByDate({ data: selectedMeetings });
        const departmentID = department?.id || '';

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

        const data = [
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
          <main id='profile-page-main'>
            <section className='page-card-section' id='avatar-header-section'>
              <div className='cover-background'>
                <img
                  src={coverImage?.url || defaultCoverImage}
                  alt='cover image'
                  className='cover-image'
                />
              </div>
              <header className='user-info-header'>
                <AvatarOrInitials
                  name={LecturerNameInEnglish}
                  url={avatar?.url}
                  className='profile-page-avatar'
                />
                <div>
                  <h4>{LecturerNameInEnglish}</h4>
                  <span className='username'>@{username}</span>
                  <span className='role-department'>
                    {`${name} - ${
                      department.DepartmentNameInEnglish || ''
                    } Department`}
                  </span>
                  <span className='faculty'>{`${
                    department?.faculty?.FacultyNameInEnglish + ' - ' || ''
                  } Tanta University`}</span>
                </div>
                {isAuthedUserProfile && (
                  <button className='btn-with-icon course-settings-btn edit-setting-profile'>
                    <div className='icons8-tune'></div>
                    <span>Edit Info</span>
                  </button>
                )}
              </header>
            </section>
            {isPrivateAccount && (
              <>
                {isActivitiesCoursesPublic && (
                  <>
                    <section id='activities-courses-section'>
                      <section
                        className='page-card-section'
                        id='activities-section'
                      >
                        <h5>Activities</h5>
                        <ul className='activities-list'>
                          {selectedMeetings
                            .slice(0, 15)
                            .map(
                              (
                                {
                                  __typename,
                                  id,
                                  LectureNumber,
                                  SectionNumber,
                                  LectureDateTime,
                                  SectionDateTime,
                                  course,
                                  groups,
                                },
                                index
                              ) => {
                                const groupsName = extractGroupsName(
                                  groups.map((g) => g.GroupNumber)
                                );

                                const presenter = isAuthedUserProfile
                                  ? 'You'
                                  : __typename === 'Section'
                                  ? `TA. ${LecturerNameInEnglish}`
                                  : `DR. ${LecturerNameInEnglish}`;

                                return (
                                  <li key={index + id}>
                                    <span>
                                      {`${presenter} created a ${__typename} ${
                                        LectureNumber || SectionNumber
                                      } for ${groupsName} for `}
                                      <span style={{ fontWeight: 500 }}>
                                        {course?.CourseNameInEnglish}
                                      </span>
                                      <span className='activities-meeting-date'>
                                        &nbsp;
                                        {'at ' +
                                          format(
                                            new Date(
                                              LectureDateTime || SectionDateTime
                                            ),
                                            'dd MMM yyyy p'
                                          )}
                                        .
                                      </span>
                                      <a
                                        href={`http://localhost:3000/courses/${course?.id}`}
                                      >
                                        &nbsp; Learn More
                                      </a>
                                    </span>
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </section>
                      <section
                        className='page-card-section'
                        id='courses-section'
                      >
                        <h5>Meetings</h5>
                        <ul className='course-meetings-list'>
                          {Object.entries(meetingsPerCourse).map(
                            ([CourseName, meetings], index) => {
                              const avatarURL =
                                meetings?.[0]?.course.CourseAvatar?.url || null;
                              const courseID = meetings?.[0]?.course?.id || '';

                              return (
                                <a
                                  key={CourseName + index}
                                  className='course-list-item'
                                  href={`http://localhost:3000/courses/${courseID}`}
                                >
                                  <div className='course-name-with-avatar'>
                                    <AvatarOrInitials
                                      url={avatarURL}
                                      name={CourseName}
                                      className='course-avatar-profile-page'
                                    />
                                    <span>{CourseName}</span>
                                  </div>
                                  <span className='meetings-count'>
                                    <h5>{meetings?.length || ''}</h5>
                                    <span>{__typename + 's' || ''}</span>
                                  </span>
                                </a>
                              );
                            }
                          )}
                        </ul>
                      </section>
                    </section>
                    <section
                      className='page-card-section'
                      id='user-calendar-chart-section'
                    >
                      <h5>{__typename}s Heatmap</h5>
                      <span>{`Total of ${selectedMeetings?.length} ${__typename}s`}</span>

                      <Chart
                        chartType='Calendar'
                        width='100%'
                        data={data}
                        options={{
                          calendar: {},
                          colorAxis: {
                            minValue: 1,
                            colors: ['#ACE7AE', '#386C3E'],
                          },
                        }}
                      />
                    </section>
                  </>
                )}
                <section id='side-section'>
                  {(isAdmin || isAuthedUserProfile) && (
                    <section className='page-card-section connect-card'>
                      <h6>Monthly Reports</h6>
                    </section>
                  )}
                  {isContactInfoVisible && (
                    <section className='page-card-section connect-card'>
                      <h6>Connect</h6>
                      <a href={`mailto:${email}`} className='menu-item'>
                        <span className='icon-button'>{<EmailIcon />}</span>
                        {email}
                      </a>
                      {PhoneNumber && (
                        <a href={`tel:+2${PhoneNumber}`} className='menu-item'>
                          <span className='icon-button'>{<PhoneIcon />}</span>
                          +2{PhoneNumber}
                        </a>
                      )}
                    </section>
                  )}
                  <section className='page-card-section connect-card'>
                    <h6>Similar Profiles</h6>
                    <Query
                      query={GET_DEPARTMENT_USERS}
                      variables={{ id: departmentID || '' }}
                      onCompletedFunction={onFetchingUsers}
                      loadingComponent={<UserWithAvatarLoader />}
                    >
                      {({}) => {
                        return (
                          <ul className='similar-profiles-users'>
                            {shuffledUsers
                              .slice(0, 5)
                              .map(
                                (
                                  {
                                    username,
                                    LecturerNameInEnglish,
                                    avatar,
                                    role,
                                  },
                                  index
                                ) => {
                                  return (
                                    <a
                                      className='similar-profile-user'
                                      href={`http://localhost:3000/profile/${username}`}
                                      key={username + index}
                                    >
                                      <AvatarOrInitials
                                        name={LecturerNameInEnglish}
                                        url={avatar?.url}
                                        className='top-user-avatar'
                                      />
                                      <div>
                                        <span className='font-weight500 third-color'>
                                          {LecturerNameInEnglish}
                                        </span>
                                        <span className='font-weight400 secondary-color'>
                                          {role?.name}
                                        </span>
                                      </div>
                                    </a>
                                  );
                                }
                              )}
                          </ul>
                        );
                      }}
                    </Query>
                  </section>
                </section>
              </>
            )}
          </main>
        );
      }}
    </Query>
  );
};

const groupMeetingsByCourseID = (meetings) => {
  try {
    let result = {};
    meetings.forEach(
      ({ course: { CourseNameInEnglish, ...courseRest }, ...rest }) => {
        if (result.hasOwnProperty(CourseNameInEnglish))
          result[CourseNameInEnglish].push({
            course: { CourseNameInEnglish, ...courseRest },
            ...rest,
          });
        else {
          result[CourseNameInEnglish] = [
            {
              CourseNameInEnglish,
              course: { CourseNameInEnglish, ...courseRest },
              ...rest,
            },
          ];
        }
      }
    );
    return result;
  } catch (err) {
    console.error(err.message);
  }
};
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...

  const operatedArray = array.slice();
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [operatedArray[currentIndex], operatedArray[randomIndex]] = [
      operatedArray[randomIndex],
      operatedArray[currentIndex],
    ];
  }

  return operatedArray;
}
