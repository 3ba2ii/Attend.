import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BarChartIcon from '@material-ui/icons/BarChart';
import CloudIcon from '@material-ui/icons/Cloud';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import Logo from '../common/Logo';

export function DrawerItems(classes, pathname) {
  return (
    <div>
      <Logo className='drawer-logo padding-left-1rem' />
      <div className={classes.toolbar} />

      {Avatar(true)}
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
                  pathname.includes(path) && ' active-nav-icon'
                }`}
              >
                {pathname.includes(path) && <div className='active' />}

                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                className={`list-item-text ${
                  pathname.includes(path) && ' active-nav-text'
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
                  pathname.includes(path) && ' active-nav-icon'
                }`}
              >
                {pathname.includes(path) && <div className='active' />}

                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                disableTypography
                className={`list-item-text ${
                  pathname.includes(path) && ' active-nav-text'
                }`}
              />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </div>
  );
}
