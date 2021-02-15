import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from '../../types/styles/AvatarColorStyles';
import AvatarOrInitials from '../Initials/AvatarOrInitials';

export const randomClass = Math.floor(Math.random() * 4);
export default function AvatarComponent() {
  const classes = useStyles();

  const { authedUser } = useSelector((state) => state?.authReducer);
  let fullName = authedUser?.LecturerNameInEnglish.split(' ');
  console.log(
    `🚀 ~ file: Avatar.js ~ line 12 ~ AvatarComponent ~ fullName`,
    fullName
  );
  fullName = `${fullName[0]} ${fullName[fullName.length - 1]}`;

  return (
    <div className='drawer-avatar-container'>
      <AvatarOrInitials
        {...{
          url: authedUser?.avatar?.url,
          name: authedUser?.LecturerNameInEnglish,
          className: classes.large,
          alt: 'avatar',
        }}
      />

      <div className='user-information'>
        <span>{fullName || 'username'}</span>
        <p>{authedUser?.role?.name || 'role'}</p>
      </div>
    </div>
  );
}
