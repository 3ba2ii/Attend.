import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import addData from '../../../assets/clip-uploading2.png';
import addLecturer from '../../../assets/clip-welcome.png';
import teacher from '../../../assets/schoolTeacher.png';

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
    path: 'assign_lecturers',
  },
  {
    id: 'addData456',
    title: 'Add Lecturers and Assistants',
    subtitle: 'Add new lecturers and assistants to the database.',
    img: addLecturer,
    path: 'add_lecturers_users',
  },
];
const SelectCardsComponent = () => {
  const { url } = useRouteMatch();
  return (
    <div className='select-cards-container'>
      {optionalProps.map((card, index) => (
        <Link
          to={`${url}/${card.path}`}
          className='single-select-card-container'
          key={card.id + index}
        >
          <div className='card-img-container'>
            <img src={card.img} alt={'opt'} />
          </div>
          <h5 className='font-weight600'>{card.title}</h5>
          <p>{card.subtitle}</p>
        </Link>
      ))}
    </div>
  );
};

export default SelectCardsComponent;
