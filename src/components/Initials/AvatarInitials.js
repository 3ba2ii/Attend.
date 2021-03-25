import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { randomClass } from '../common/Avatar';
import { avatarStyles } from 'types/styles';

export function AvatarInitials(Initials, className) {
  const classes = avatarStyles();
  const MyColorsArray = [classes.purple, classes.orange, classes.lightBlue];
  return (
    <Avatar
      className={MyColorsArray[randomClass] + ` ${className || ''}`}
      alt='avatar'
    >
      {Initials}
    </Avatar>
  );
}
