import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import smallAvatar from '../../assets/Ellipse.png';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import AddLecturersPage from '../../Pages/DataEntry/AddLecturers/AddLecturers';
import AssignLecturersPage from '../../Pages/DataEntry/AssignLectures/AssignLecturers';
import AssignLecturerToCourse from '../../Pages/DataEntry/AssignLectures/AssignLecturerToCourse';
import DataEntryPage from '../../Pages/DataEntry/DataEntryMainPage/DataEntry';
import ImportStudentContainer from '../../Pages/DataEntry/ImportStudents/ImportStudents';
import useStyles from '../../types/styles/drawer-styles';
import './drawer-layout.css';
import { DrawerItems } from './DrawerItems';
function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let { pathname } = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          <Route exact path={'/'} component={Dashboard} />
          <Route path={'/dashboard'} component={Dashboard} />
          <Route exact path={'/data_entry'} component={DataEntryPage} />
          <Route
            exact
            path={`/data_entry/import_students`}
            component={ImportStudentContainer}
          />

          <Route
            exact
            path={'/data_entry/add_lecturers_users'}
            component={AddLecturersPage}
          />
          <Route
            exact
            path={'/data_entry/assign_lecturers'}
            component={AssignLecturersPage}
          />
          <Route
            exact
            path={'/data_entry/assign_lecturers/:courseID'}
            component={AssignLecturerToCourse}
          />
          <Route path={'/courses'} render={() => <div>Hellooo</div>} />
          <Route path={'/profile'} render={() => <div>Hellooo</div>} />
          <Route path={'/leaderboard'} render={() => <div>leaderboard</div>} />
          <Route path={'/help'} render={() => <div>Hellooo</div>} />
          <Route path={'/settings'} render={() => <div>Hellooo</div>} />
        </Switch>
      </main>
    </div>
  );
}

function AppBarComponent(classes, handleDrawerToggle) {
  return (
    <AppBar position='fixed' className={classes.appBar} elevation={0}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon fontSize={'small'} />
          </div>
          <InputBase
            placeholder='Search for courses subjects or students..'
            style={{
              fontSize: 'small',
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
            <NotificationsNoneOutlinedIcon style={{ color: '#C2CFE0' }} />
          </Badge>
        </IconButton>
        <IconButton
          edge='end'
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
        >
          <img src={smallAvatar} alt='small-avatar' className='small-avatar' />
          <ArrowDropDownIcon style={{ color: '#AEAEAE' }} />
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
