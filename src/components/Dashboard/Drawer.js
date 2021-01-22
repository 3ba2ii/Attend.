import React from 'react';
import './drawer-layout.css';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import useStyles from '../../types/styles/drawer-styles';
import Logo from '../common/Logo';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';

import BarChartIcon from '@material-ui/icons/BarChart';
import CloudIcon from '@material-ui/icons/Cloud';
import SettingsIcon from '@material-ui/icons/Settings';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import avatar from '../../assets/Ellipse.png';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        elevation={0}
      >
        <Toolbar className='toolbar'>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          {!open && <Logo className='drawer-logo' />}
        </Toolbar>
      </AppBar>
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
        <div className='avatar-drawer'>
          <img src={avatar} alt={'avatar'} />
          {open && (
            <div>
              <span>Dr. M.Elshewami</span>
              <p>Admin</p>
            </div>
          )}
        </div>
        <List className='navbar-list'>
          {[
            { text: 'Dashboard', icon: <DashboardIcon /> },
            { text: 'My Profile', icon: <PersonIcon /> },
            { text: 'Courses', icon: <SchoolIcon /> },
            { text: 'Leaderboard', icon: <BarChartIcon /> },
            { text: 'Data Entry', icon: <CloudIcon /> },
          ].map((item, index) => (
            <ListItem button key={item.text + index}>
              <ListItemIcon className='list-item-icon'>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} className='list-item-text' />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List className='navbar-list'>
          {[
            { text: 'Need Help?', icon: <HelpOutlineIcon /> },
            { text: 'Settings', icon: <SettingsIcon /> },
          ].map((item, index) => (
            <ListItem button key={item.text + index}>
              <ListItemIcon className='list-item-icon'>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} className='list-item-text' />
            </ListItem>
          ))}
        </List>
        <Divider />

        <button className={`monthly-report-button ${!open && 'only-icon'}`}>
          <ListItemIcon className='monthly-button-icon'>
            <InsertDriveFileOutlinedIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={'Get Monthly Reports'}
              className='monthly-button-text'
              disableTypography
            />
          )}
        </button>
        <button className='logout-btn'>
          <List className='logout-btn'>
            {[{ text: 'Logout', icon: <ExitToAppIcon /> }].map(
              (item, index) => (
                <ListItem button key={item.text + index}>
                  <ListItemIcon className='list-item-icon'>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    className='list-item-text'
                  />
                </ListItem>
              )
            )}
          </List>
        </button>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </main>
    </div>
  );
}
