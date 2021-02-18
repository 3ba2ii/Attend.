import React from 'react';
import { useSelector } from 'react-redux';
import { avatarStyles } from '../../types/styles/';
import AvatarOrInitials from '../Initials/AvatarOrInitials';

export const randomClass = Math.floor(Math.random() * 4);
export default function AvatarComponent() {
  const classes = avatarStyles();

  const { authedUser } = useSelector((state) => state?.authReducer);
  let fullName = authedUser?.LecturerNameInEnglish.split(' ');
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
