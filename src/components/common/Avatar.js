import React from 'react';
import { useSelector } from 'react-redux';
import AvatarOrInitials from '../Initials/AvatarOrInitials';

export const randomClass = Math.floor(Math.random() * 3);
export default function AvatarComponent() {
  const { authedUser } = useSelector((state) => state?.authReducer);
  let fullName = authedUser?.LecturerNameInEnglish.split(' ');
  fullName = `${fullName[0]} ${fullName[fullName.length - 1]}`;

  return (
    <div className='drawer-avatar-container'>
      <AvatarOrInitials
        {...{
          url: authedUser?.avatar?.url,
          name: authedUser?.LecturerNameInEnglish,
          className: 'drawer-avatar',
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
