import uploadData from 'assets/clip-uploading.svg';
import wl from 'assets/clip-welcome.svg';
import sh from 'assets/schoolTeacher.svg';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const optionalProps = [
  {
    id: 'addData123',
    title: 'Data Entry',
    subtitle: 'Add or Remove students to and from the database.',
    img: <img src={uploadData} className='svg-img' alt={'Data Entry'} />,

    path: 'import_students',
  },
  {
    id: 'assignLecturers',
    title: 'Assign Lecturers',
    subtitle: 'Assign lecturers to certain courses.',
    img: <img src={sh} className='svg-img' alt={'Assign Lecturers'} />,
    path: 'assign_lecturers',
  },
  {
    id: 'addLecturers',
    title: 'Add Lecturers and Assistants',
    subtitle: 'Add new lecturers and assistants to the database.',
    img: <img src={wl} className='svg-img' alt={'Add Lecturers'} />,
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
          <div className='card-img-container'>{card.img}</div>
          <h5 className='font-weight600'>{card.title}</h5>
          <p>{card.subtitle}</p>
        </Link>
      ))}
    </div>
  );
};

export default SelectCardsComponent;
