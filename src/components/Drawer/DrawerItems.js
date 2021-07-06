import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SignOut } from 'redux/actions/authedAction';
import { getFullName } from 'utlis/helpers/getFullName';
import Logo from '../common/Logo';

export function DrawerItems(classes, pathname) {
  const { authedUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  return (
    <div className='drawer-container'>
      <div>
        <Logo className='small-logo drawer-logo' />
        <div className={classes.toolbar} />
        <div className='drawer-avatar-container'>
          <AvatarOrInitials
            {...{
              url: authedUser?.avatar?.url,
              name: authedUser?.LecturerNameInEnglish,
              className: 'small-drawer-avatar',
              alt: 'avatar',
            }}
          />
          <div className='user-information'>
            <span>
              {getFullName(authedUser?.LecturerNameInEnglish) || 'username'}
            </span>
            <p>{authedUser?.role?.name || 'role'}</p>
          </div>
        </div>
        <List className='navbar-list'>
          {drawerNavOptions({ authedUser }).map(
            ({ text, icon, iconActive, path }, index) => {
              if (path)
                return (
                  <Link to={path} key={text + index}>
                    <ListItem button>
                      <ListItemIcon
                        className={`list-item-icon ${
                          pathname.includes(path) && ' active-nav-icon'
                        }`}
                      >
                        {pathname.includes(path) && <div className='active' />}
                        <div className='drawer-icon-container'>
                          {pathname.includes(path) ? iconActive : icon}
                        </div>
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
                );
            }
          )}
        </List>
        <Divider />
        <List className='navbar-list'>
          {[
            {
              text: 'Need Help?',
              icon: <span className='icons8-help' alt={'Leaderboard'} />,
              iconActive: (
                <span className='icons8-help-active' alt={'Leaderboard'} />
              ),
              path: '/help',
            },
            {
              text: 'Settings',
              icon: <span className='icons8-settings' alt={'Leaderboard'} />,
              iconActive: (
                <span className='icons8-settings-active' alt={'Leaderboard'} />
              ),
              path: '/settings',
            },
          ].map(({ text, icon, iconActive, path }, index) => (
            <Link to={path} key={text + index}>
              <ListItem button>
                <ListItemIcon
                  className={`list-item-icon ${
                    pathname.includes(path) && ' active-nav-icon'
                  }`}
                >
                  {pathname.includes(path) && <div className='active' />}
                  <div className='drawer-icon-container'>
                    {pathname.includes(path) ? iconActive : icon}
                  </div>
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
      <ListItem
        onClick={() => {
          const action = SignOut();
          dispatch(action);
        }}
        button
        style={{ position: 'relative', bottom: '10px', cursor: 'pointer' }}
      >
        <ListItemIcon className={`list-item-icon`}>
          <div className='drawer-icon-container'>{}</div>
        </ListItemIcon>
        <ListItemText
          primary={'Logout'}
          disableTypography
          className={`list-item-text`}
        />
      </ListItem>
    </div>
  );
}
const drawerNavOptions = ({ authedUser }) => [
  {
    text: 'Dashboard',
    icon: <span className='icons8-dashboard' alt={'Dashboard'} />,
    iconActive: <span className='icons8-dashboard-active' alt={'Course'} />,
    path: '/dashboard',
  },
  {
    text: 'My Profile',
    icon: <span className='icons8-user' alt={'My Profile'} />,
    iconActive: <span className='icons8-user-active' alt={'My Profile'} />,
    path: `/profile/${authedUser.username}`,
  },
  {
    text: 'Courses',
    icon: <span className='icons8-course' alt={'Courses'} />,
    iconActive: <span className='icons8-course-active' alt={'Courses'} />,
    path: '/courses',
  },
  {
    text: 'Leaderboard',
    icon: <span className='icons8-account' alt={'Leaderboard'} />,
    iconActive: <span className='icons8-account-active' alt={'Leaderboard'} />,
    path: '/leaderboard',
  },
  authedUser?.role?.name === 'Super Admin' && {
    text: 'Admin Panel',
    icon: <span className='icons8-cloud' alt={'Admin Panel'} />,
    iconActive: <span className='icons8-cloud-active' alt={'Admin Panel'} />,
    path: '/admin_panel',
  },
];
