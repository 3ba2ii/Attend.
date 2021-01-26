import React from 'react';
import { useSelector } from 'react-redux';
import avatar from '../../assets/Ellipse.png';

export function Avatar(open) {
  const { user } = useSelector((state) => state?.authReducer?.authedUser);

  return (
    <div className='avatar-drawer'>
      <img src={avatar} alt={'avatar'} />
      {open && (
        <div>
          <span>{user.username}</span>
          <p>{user?.role?.name}</p>
        </div>
      )}
    </div>
  );
}
