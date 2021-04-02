import Avatar from '@material-ui/core/Avatar';
import { randomClass } from './Avatar';
import { avatarStyles } from 'types/styles';

const AvatarOrInitials = ({ url, name, className, alt }) => {
  const classes = avatarStyles();

  if (url) {
    return <Avatar alt={alt || 'avatar'} src={url} />;
  }
  if (name) {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return AvatarInitials(initials, className, classes);
  }
};

function AvatarInitials(Initials, className, classes) {
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

export default AvatarOrInitials;
