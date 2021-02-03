import React from 'react';
import { useSelector } from 'react-redux';

export function Avatar(open) {
  const { user } = useSelector((state) => state?.authReducer?.authedUser);
  const { lecturer } = user;
  const InitialsName = lecturer?.LecturerNameInEnglish.split(' ');

  const fullName = `Dr. ${InitialsName[0]} ${
    InitialsName[InitialsName.length - 1]
  }`;
  return (
    <div className='avatar-drawer'>
      <img src={lecturer?.avatar?.url} alt={'avatar'} className='avatar' />
      {open && (
        <div>
          <span>{fullName}</span>
          <p>{user?.role?.name}</p>
        </div>
      )}
    </div>
  );
}
