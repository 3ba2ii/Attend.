import React from 'react';
import { useLocation, Link, Route, Switch } from 'react-router-dom';

import './drawer-layout.css';
import clsx from 'clsx';

import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import useStyles from '../../types/styles/drawer-styles';

import Logo from '../common/Logo';
import { Avatar } from '../common/Avatar';

import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import CloudIcon from '@material-ui/icons/Cloud';

import PrimarySearchAppBar from './AppBar';
import { useDispatch } from 'react-redux';
import { SignOut } from '../../redux-store/actions/authedAction';
import Dashboard from '../Dashboard/Dashboard';

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  var { width } = window.screen;

  const [open, setOpen] = React.useState(width >= 500);

  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  window.onresize = window.onload = function () {
    width = this.innerWidth;
    if (width < 720) setOpen(false);
  };

  const onLogout = () => {
    const action = SignOut();
    dispatch(action);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <PrimarySearchAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <Logo className='drawer-logo padding-left-1rem' />

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        {Avatar(open)}
        <List className='navbar-list'>
          {[
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
            { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
            {
              text: 'Leaderboard',
              icon: <BarChartIcon />,
              path: '/leaderboard',
            },
            { text: 'Data Entry', icon: <CloudIcon />, path: '/data_entry' },
          ].map(({ text, icon, path }, index) => (
            <Link to={path} key={text + index}>
              <ListItem button>
                <ListItemIcon
                  className={`list-item-icon ${
                    path === pathname && ' active-nav-icon'
                  }`}
                >
                  {path === pathname && <div className='active' />}

                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  className={`list-item-text ${
                    path === pathname && ' active-nav-text'
                  }`}
                  disableTypography
                />
              </ListItem>
            </Link>
          ))}
        </List>

        <Divider />
        <List className='navbar-list'>
          {[
            { text: 'Need Help?', icon: <HelpOutlineIcon />, path: '/help' },
            { text: 'Settings', icon: <TuneOutlinedIcon />, path: '/settings' },
          ].map(({ text, icon, path }, index) => (
            <Link to={path} key={text + index}>
              <ListItem button>
                <ListItemIcon
                  className={`list-item-icon ${
                    path === pathname && ' active-nav-icon'
                  }`}
                >
                  {path === pathname && <div className='active' />}

                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  disableTypography
                  className={`list-item-text ${
                    path === pathname && ' active-nav-text'
                  }`}
                />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />

        <button className='logout-btn' onClick={onLogout}>
          <ListItem button key={'logout-btnss'}>
            <ListItemIcon className='list-item-icon'>
              <PowerSettingsNewOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={'Logout'}
              className='list-item-text'
            />
          </ListItem>
        </button>
      </Drawer>
      <div
        className={
          open ? classes.contentWhenDrawerOpen : classes.contentWhenDrawerClosed
        }
      >
        <Switch>
          <Route path={'/dashboard'} render={() => <Dashboard {...open} />} />
          <Route path={'/data_entry'} render={() => <div>Hellooo</div>} />
          <Route path={'/courses'} render={() => <div>Hellooo</div>} />
          <Route path={'/profile'} render={() => <div>Hellooo</div>} />
          <Route path={'/leaderboard'} render={() => <div>leaderboard</div>} />
          <Route path={'/help'} render={() => <div>Hellooo</div>} />
          <Route path={'/settings'} render={() => <div>Hellooo</div>} />
        </Switch>
      </div>
    </div>
  );
}
