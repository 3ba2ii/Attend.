import { useEffect, useState } from 'react';
import './avatar.css';

const colors = [
  { bg: '#FAE2E1', color: '#bf0e08' },
  { bg: '#ec4c47', color: 'white' },
  { bg: '#fae3cd', color: '#95591e' },
  { bg: '#eae7f8', color: '#37248f' },
  { bg: '#47b881', color: 'white' },
  { bg: '#fae2e2', color: '#bf0e08' },
];

const AvatarOrInitials = ({ url, name, className }) => {
  const [selectedColor, setSelectedColor] = useState({});
  useEffect(() => {
    const randomColor = Math.floor(Math.random() * 6);

    setSelectedColor(colors[randomColor]);
  }, []);
  const initials = getInitials(name);

  if (url) {
    return <img src={url} alt={name} className={className} />;
  }
  return (
    <div
      className={`initials-container ${className}`}
      style={{
        color: selectedColor.color,
        background: selectedColor.bg,
      }}
    >
      {initials}
    </div>
  );
};

const getInitials = (name) => {
  if (name) {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return initials;
  }
};
export default AvatarOrInitials;
