import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },

  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function AvatarComponent() {
  const classes = useStyles();

  const { authedUser } = useSelector((state) => state?.authReducer);

  const InitialsName = authedUser?.LecturerNameInEnglish.split(' ');
  const n = InitialsName && InitialsName.length;

  const fullName =
    InitialsName && `Dr. ${InitialsName[0]} ${InitialsName[n - 1]}`;

  const Initials =
    InitialsName &&
    `${InitialsName[0].charAt(0)}${InitialsName[n - 1].charAt(0)}`;

  return (
    <div className='drawer-avatar-container'>
      {authedUser?.avatar?.url ? (
        <Avatar
          src={authedUser?.avatar?.url}
          className={classes.large}
          alt='avatar'
        />
      ) : (
        <Avatar className={classes.orange} alt='avatar'>
          {Initials}
        </Avatar>
      )}

      <div className='user-information'>
        <span>{fullName || 'username'}</span>
        <p>{authedUser?.role?.name || 'role'}</p>
      </div>
    </div>
  );
}
