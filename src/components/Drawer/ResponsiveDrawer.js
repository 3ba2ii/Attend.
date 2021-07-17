import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { GET_USER_NOTIFICATIONS } from 'api/queries/getUserNotifications';
import axios from 'axios';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import Query from 'components/Query';
import { formatDistance } from 'date-fns/esm';
import { CoursePage } from 'pages/CoursePage/CoursePage';
import { CoursesPage } from 'pages/CoursesPage/CoursesPage';
import StaffPage from 'pages/DataEntry/Staff/StaffPage';
import { ProfilePage } from 'pages/MyProfilePage/ProfilePage';
import SettingsPage from 'pages/Settings/SettingsPage';
import { StudentPage } from 'pages/StudentPage/index.js';
import PropTypes from 'prop-types';
import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { drawerStyles } from 'types/styles/';
import './drawer-layout.css';
import { DrawerItems } from './DrawerItems';
const AddLecturersPage = lazy(() =>
  import('pages/DataEntry/AddLecturers/AddLecturers')
);
const AdminPanel = lazy(() => import('pages/DataEntry/AdminPanel/AdminPanel'));
const AssignLecturersPage = lazy(() =>
  import('pages/DataEntry/AssignLectures/AssignLecturers')
);

const ImportStudentContainer = lazy(() =>
  import('pages/DataEntry/ImportStudents/ImportStudents')
);
const NotFound404 = lazy(() => import('pages/ErrorPages/404'));
function ResponsiveDrawer(props) {
  const { window } = props;
  const {
    authedUser: {
      role: { name },
    },
  } = useSelector((state) => state.authReducer);

  const classes = drawerStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  let { pathname } = useLocation();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [setMobileOpen, mobileOpen]);

  const drawerItems = DrawerItems(classes, pathname);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      {AppBarComponent(classes, handleDrawerToggle)}
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawerItems}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawerItems}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Switch>
          <Route
            path={'/'}
            exact
            render={() => {
              return <div>Hello</div>;
            }}
          />
          <Route
            path={'/dashboard'}
            render={() => {
              return <div>Hello</div>;
            }}
          />
          <Route exact path={'/admin_panel'} component={AdminPanel} />
          <Route
            exact
            path={`/admin_panel/import_students`}
            component={ImportStudentContainer}
          />

          <Route
            exact
            path={'/admin_panel/invite_users'}
            component={AddLecturersPage}
          />
          <Route
            exact
            path={'/admin_panel/admin_courses'}
            component={AssignLecturersPage}
          />
          <Route
            exact
            path={'/admin_panel/admin_courses/:courseID'}
            component={CoursePage}
          />
          <Route exact path={'/courses/:courseID'} component={CoursePage} />
          <Route path={'/admin_panel/staff'} component={StaffPage} />
          <Route path={'/courses'} component={CoursesPage} />

          <Route path={'/profile/:username'} component={ProfilePage} />
          <Route
            exact
            path='/student/:studentID'
            render={() => <StudentPage />}
          />

          <Route path={'/leaderboard'} render={() => <div>leader-board</div>} />
          <Route path={'/help'} render={() => <div>Hello</div>} />
          <Route path={'/settings'} render={() => <SettingsPage />} />
          <Route path='/404' component={NotFound404} />
          <Redirect to='/404' />
        </Switch>
      </main>
    </div>
  );
}

function AppBarComponent(classes, handleDrawerToggle) {
  const {
    authedUser: { avatar, LecturerNameInEnglish, id },
  } = useSelector((state) => state?.authReducer);

  const [openNotificationsDropdown, setOpenNotificationsDropdown] =
    useState(false);

  const handleOpenNotificationsDropdown = () => {
    setOpenNotificationsDropdown(!openNotificationsDropdown);
  };
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <div className='icons8-menu'></div>
        </IconButton>

        {AppBarSearch(classes)}
        <div className={classes.grow} />

        <div className='notifications-container-with-icon'>
          <IconButton
            aria-label='show new notifications'
            color='inherit'
            style={{ position: 'relative' }}
            onClick={handleOpenNotificationsDropdown}
          >
            <Badge variant='dot' color='secondary'>
              <div className='icons8-notification'></div>
            </Badge>
          </IconButton>

          <CSSTransition
            in={openNotificationsDropdown}
            unmountOnExit
            timeout={100}
            classNames={'identifier-error'}
          >
            <NotificationsDropdown id={id} />
          </CSSTransition>
        </div>

        <IconButton
          edge='end'
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
        >
          <AvatarOrInitials
            {...{
              url: avatar?.url,
              name: LecturerNameInEnglish,
              className: 'small-appbar-avatar',
            }}
          />

          <div className='icons8-expand-arrow'></div>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveDrawer;
let timerID;
function NotificationsDropdown({ id }) {
  return (
    <section className='notifications-modal'>
      <header>
        <h6>Notification Center</h6>
      </header>
      <Query
        query={GET_USER_NOTIFICATIONS}
        variables={{ id: id }}
        loadingComponent={<NotificationsLoading />}
      >
        {({ data: { user } }) => {
          const { courses } = user || { courses: null };
          if (!courses)
            return <h6 className='font-weight500'>No Notifications Yet</h6>;
          let notificationsSorted = [];
          courses.forEach(({ notifications }) =>
            notifications.map((notification) => {
              notificationsSorted.push(notification);
            })
          );
          notificationsSorted = notificationsSorted.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          return (
            <ul className='notifications-list'>
              {notificationsSorted
                .slice(0, 15)
                .map(({ course, student, isSeen, createdAt, type }) => {
                  return (
                    <NotificationItem
                      {...{ course, student, isSeen, createdAt, type }}
                    />
                  );
                })}
            </ul>
          );
        }}
      </Query>
    </section>
  );
}

const NotificationItem = ({ id, course, student, isSeen, createdAt, type }) => {
  if (!student) return null;
  const { CourseNameInEnglish } = course;
  const { StudentNameInArabic, id: studentID } = student;
  const timeDifference = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true,
  });
  const getTypeNameMessage = (type) => {
    switch (type) {
      case 'alert30':
        return `Attendance Alert for ${StudentNameInArabic} for exceeding 30% attendance alert for ${CourseNameInEnglish} Course`;
      case 'alert50':
        return `Attendance Alert for ${StudentNameInArabic} for exceeding 50% attendance alert for ${CourseNameInEnglish} Course`;

      case 'alert60':
        return `Attendance Alert for ${StudentNameInArabic} for exceeding 60% attendance alert for ${CourseNameInEnglish} Course`;
      default:
        return '';
    }
  };
  const typeNameMessage = getTypeNameMessage(type);
  return (
    <Link key={id} className='notification-item' to={`/student/${studentID}`}>
      <AvatarOrInitials
        name={StudentNameInArabic}
        className='small-notifications-avatar'
      />
      <div>
        <span className='font-weigh500'>{typeNameMessage}</span>
        <span className='font-weigh400'>{timeDifference}</span>
      </div>
    </Link>
  );
};
function AppBarSearch(classes) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchFieldRef = useRef(null);
  const [isSearchbarFocused, setSearchbarFocus] = useState(false);

  const [options, setOptions] = useState([]);

  const onInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const setFocusFlag = (e) => {
    setSearchbarFocus(true);
  };
  const clearFocusFlag = (e) => {
    setSearchbarFocus(false);
  };

  const onStudentClicked = () => {
    setSearchbarFocus(false);
  };
  useEffect(() => {
    clearTimeout(timerID);
    timerID = setTimeout(async () => {
      const options = await fetchStudentsSuggestions(searchQuery);
      setOptions(options || []);
    }, 200);
  }, [searchQuery]);
  return (
    <>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <div className='icons8-search'></div>
        </div>
        <InputBase
          placeholder='Search for students..'
          value={searchQuery}
          inputRef={searchFieldRef}
          onFocus={setFocusFlag}
          onBlur={clearFocusFlag}
          onChange={onInputChange}
          style={{
            fontSize: '.9rem',
            fontWeight: '500',
            fontFamily: 'Poppins' || 'sans-serif',
          }}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
      <CSSTransition
        in={options.length !== 0 && isSearchbarFocused}
        unmountOnExit
        timeout={100}
        classNames={'identifier-error'}
      >
        <ul className='search-suggestions'>
          <small>Students</small>
          {options.map(
            ({ _id, StudentNameInArabic, StudentOfficialEmail }, index) => {
              return (
                <Link
                  to={`/student/${_id}`}
                  key={_id + StudentNameInArabic + index}
                  className='student-info-search'
                  onClick={onStudentClicked}
                >
                  <AvatarOrInitials
                    name={StudentNameInArabic}
                    className='small-drawer-avatar-search'
                  />
                  <div>
                    <span>{StudentNameInArabic}</span>
                    <span>{StudentOfficialEmail}</span>
                  </div>
                </Link>
              );
            }
          )}
        </ul>
      </CSSTransition>
    </>
  );
}

const fetchStudentsSuggestions = async (searchQuery) => {
  if (!searchQuery) return;
  try {
    const data = await axios
      .get(
        `https://gxon8n2vi4.execute-api.eu-central-1.amazonaws.com/default`,

        {
          params: {
            query: searchQuery,
          },
        }
      )
      .then(({ data: { body } }) => {
        return body;
      });

    return JSON.parse(data);
  } catch (e) {
    console.error(e.message);
    return [];
  }
};
ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const NotificationsLoading = (props) => {
  return (
    <ContentLoader
      height={54}
      width={320}
      viewBox='0 0 320 54'
      backgroundColor='#f3f3f3'
      foregroundColor='#ecebeb'
      {...props}
    >
      <circle cx='27' cy='27' r='18' />
      <rect x='53' y='14' rx='3' ry='3' width='180' height='13' />
      <rect x='53' y='30' rx='3' ry='3' width='10' height='10' />
      <rect x='67' y='30' rx='3' ry='3' width='74' height='10' />
      <circle cx='305' cy='27' r='8' />
      <rect x='0' y='53' rx='0' ry='0' width='320' height='1' />
      <rect x='219' y='146' rx='0' ry='0' width='0' height='0' />
    </ContentLoader>
  );
};
