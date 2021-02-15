import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { randomClass } from '../common/Avatar';
import { useStyles } from '../../types/styles/AvatarColorStyles';

export function AvatarInitials(Initials) {
  const classes = useStyles();
  const MyColorsArray = [classes.purple, classes.orange, classes.lightBlue];
  return (
    <Avatar className={MyColorsArray[randomClass]} alt='avatar'>
      {Initials}
    </Avatar>
  );
}
