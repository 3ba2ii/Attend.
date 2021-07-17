import uploadData from 'assets/clip-uploading.svg';
import wl from 'assets/clip-welcome.svg';
import sh from 'assets/schoolTeacher.svg';
import colleagues from 'assets/clip-961.svg';
import { Link, useRouteMatch } from 'react-router-dom';

const optionalProps = [
  {
    id: 'addData123',
    title: 'Import Students',
    subtitle:
      'Here you can import students to the database immediately using a .csv or .xlsx file, and you can delete students groups as well. ',
    img: <img src={uploadData} alt={'Data Entry'} />,

    path: 'import_students',
  },
  {
    id: 'assign_courses',
    title: 'Assign Courses',
    subtitle:
      'Here you can assign lecturers and teacher assistants to courses so that they have access to take attendance for, and you can un-assign courses from them as well.',

    img: <img src={sh} alt={'Assign Courses'} />,
    path: 'admin_courses',
  },
  {
    id: 'addLecturers',
    title: 'Invite Users',
    subtitle:
      "Here you can send invitations to new lecturers' and TAs accounts using their official email address, and you can also delete some accounts.",
    img: <img src={wl} alt={'Add Lecturers'} />,
    path: 'invite_users',
  },
  {
    id: 'staff',
    title: 'Staff & Users',
    subtitle:
      "Here you can send invitations to new lecturers' and TAs accounts using their official email address, and you can also delete some accounts.",
    img: <img src={colleagues} alt={'Staff'} />,
    path: 'staff',
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
          <header>
            <h6 className='font-weight600'>{card.title}</h6>
          </header>
        </Link>
      ))}
    </div>
  );
};

export default SelectCardsComponent;
