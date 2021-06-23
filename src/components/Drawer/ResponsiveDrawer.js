import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import { CoursePage } from 'pages/CoursePage/CoursePage';
import { AdminDashboard } from 'pages/Dashboard/Dashboard';
import StaffPage from 'pages/DataEntry/Staff/StaffPage';
import SettingsPage from 'pages/Settings/SettingsPage';
import PropTypes from 'prop-types';
import React, { lazy, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { drawerStyles } from 'types/styles/';
import './drawer-layout.css';
import { DrawerItems } from './DrawerItems';

const DashboardPage = lazy(() => import('pages/Dashboard/Dashboard'));
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
              if (name === 'Super Admin') return <AdminDashboard />;
              return <DashboardPage />;
            }}
          />
          <Route
            path={'/dashboard'}
            render={() => {
              if (name === 'Super Admin') return <AdminDashboard />;
              return <DashboardPage />;
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
          <Route path={'/admin_panel/staff'} component={StaffPage} />
          <Route path={'/courses'} render={() => <div>Hello</div>} />
          <Route path={'/profile'} render={() => <div>Hello</div>} />
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
    authedUser: { avatar, LecturerNameInEnglish, role },
  } = useSelector((state) => state?.authReducer);
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

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <div className='icons8-search'></div>
          </div>
          <InputBase
            placeholder='Search for courses subjects or students..'
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
        <div className={classes.grow} />

        <IconButton aria-label='show new notifications' color='inherit'>
          <Badge variant='dot' color='secondary'>
            <div className='icons8-notification'></div>
          </Badge>
        </IconButton>
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

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
