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
//A -> Z = 65 -> 90
// أ -> ي
const alphabets =
  'abcdefghijklmnopqrstuvwxyzأبجدهوزحطيكلمنسعفصقرشتثخذضظغأ0123456789';
const AvatarOrInitials = ({ url, name, className }) => {
  const [selectedColor, setSelectedColor] = useState({});

  useEffect(() => {
    let colorIndex = 0;
    let selectedColor = colors[5];
    if (name && !url) {
      if (alphabets.includes(name.toLowerCase().charAt(0))) {
        colorIndex = alphabets.indexOf(name.charAt(0).toLowerCase());
      }
    }

    if (colorIndex >= 0 && colorIndex < 13) selectedColor = colors[0];
    else if (colorIndex >= 13 && colorIndex < 26) selectedColor = colors[1];
    else if (colorIndex >= 26 && colorIndex < 39) selectedColor = colors[2];
    else if (colorIndex >= 39 && colorIndex < 52) selectedColor = colors[3];
    else if (colorIndex >= 52 && colorIndex < 65) selectedColor = colors[4];

    setSelectedColor(selectedColor);
  }, [name]);
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
