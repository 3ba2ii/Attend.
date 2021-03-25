import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import addData from 'assets/clip-uploading2.png';
import addLecturer from 'assets/clip-welcome.png';
import teacher from 'assets/schoolTeacher_ybm0cb_c_scale,w_912.png';

const optionalProps = [
  {
    id: 'addData123',
    title: 'Data Entry',
    subtitle: 'Add or Remove students to and from the database.',
    img: <img src={addData} alt='import-students' />,

    path: 'import_students',
  },
  {
    id: 'assignLecturers',
    title: 'Assign Lecturers',
    subtitle: 'Assign lecturers to certain courses.',
    img: <img src={teacher} alt='assign-lectures' />,
    path: 'assign_lecturers',
  },
  {
    id: 'addLecturers',
    title: 'Add Lecturers and Assistants',
    subtitle: 'Add new lecturers and assistants to the database.',
    img: <img src={addLecturer} alt='add-lectures' />,
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
