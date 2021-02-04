import React, { useState } from 'react';
import addData from '../../assets/clip-uploading2.png';
import teacher from '../../assets/schoolTeacher.png';
import addLecturer from '../../assets/clip-welcome.png';

const optionalProps = [
  {
    id: 'addData123',
    title: 'Data Entry',
    subtitle: 'Add or Remove students to and from the database.',
    img: addData,
    path: 'import_students',
  },
  {
    id: 'addData234',
    title: 'Assign Lecturers',
    subtitle: 'Assign lecturers to certain courses.',
    img: teacher,
    path: 'mutate_data2',
  },
  {
    id: 'addData456',
    title: 'Add Lecturers and Assistants',
    subtitle: 'Add new lecturers and assistants to the database.',
    img: addLecturer,
    path: 'mutate_data3',
  },
];
const SelectCardsComponent = ({ setSelectedPath }) => {
  const [selected, setSelected] = useState(null);
  const handleSelect = (index, card) => {
    setSelected(index);
    setSelectedPath(card.path);
  };
  return (
    <div className='select-cards-container'>
      {optionalProps.map((card, index) => (
        <div
          key={card.id}
          className={`single-select-card-container ${
            selected === index && 'selected-card'
          }`}
          onClick={(e) => handleSelect(index, card)}
        >
          <div className='card-img-container'>
            <img src={card.img} alt={'opt'} />
          </div>
          <h5>{card.title}</h5>
          <p>{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default SelectCardsComponent;
