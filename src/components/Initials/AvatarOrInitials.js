import { AvatarInitials } from './AvatarInitials';

const AvatarOrInitials = ({ url, name, className, alt }) => {
  if (url) {
    return <img src={url} alt={alt} className={className} />;
  }
  if (name) {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return AvatarInitials(initials);
  }
  return null;
};
export default AvatarOrInitials;
