import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import { GET_COURSES_INFO } from '../../../api/queries/getCoursesInfo';
import CoursesCardsContainer from '../../../components/CoursesCards/CoursesCardsContainer';
import SpinnerElement from '../../../components/Spinner/spinner';
import { handleChangesAndReturnNextState } from '../../../utlis/helpers/handleChangesAndReturnNextState';
import { SelectFormContainer } from '../AdminPanel/SelectFormContainer';
import './assign-lecturers.css';
import searching from '../../../assets/searching.png';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(1.5, 5, 2, 0),
        width: '50ch',
      },
      [theme.breakpoints.up('lg')]: {
        width: '60ch',
      },
      [theme.breakpoints.up('xl')]: {
        width: '80ch',
      },
    },
  },
}));
const AssignLecturersPage = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_COURSES_INFO);
  const faculties = data?.faculties;
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [term, setTerm] = useState('');
  const [terms, setTerms] = useState([]);
  const [courses, setCourses] = useState([]);

  const onSelectFaculty = useCallback(
    (e) => {
      setAcademicYears([]);
      setAcademicYear([]);
      setCourses([]);
      setTerm([]);
      handleChangesAndReturnNextState(
        e,
        setFaculty,
        setDepartments,
        faculties,
        'departments'
      );
    },
    [faculties, setFaculty, setDepartments]
  );
  const onSelectDepartment = useCallback(
    (e) => {
      setCourses([]);
      setTerms([]);
      setTerm([]);

      handleChangesAndReturnNextState(
        e,
        setDepartment,
        setAcademicYears,
        departments,
        'academic_years'
      );
    },
    [departments, setDepartment, setAcademicYears]
  );

  const onSelectAcademicYear = useCallback(
    (e) => {
      setTerm([]);
      handleChangesAndReturnNextState(
        e,
        setAcademicYear,
        setTerms,
        academicYears,
        'terms'
      );
    },
    [academicYears, setTerm, setTerms, setAcademicYear]
  );
  const onSelectTerm = useCallback(
    (e) => {
      setTerm(e.target.value);
      let selectedTerm = terms.filter((term) => term.id === e.target.value);
      setCourses(selectedTerm[0].courses);
    },
    [setTerm, setCourses, terms]
  );
  if (loading)
    return (
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    );
  if (error) return `Error! ${error.message}`;
  return (
    <main id='assign-lecturers-page'>
      <header>
        <h4>
          Please fill the following fields to show the associated courses.
        </h4>
        <p>
          If the desired course is not displayed, Please{' '}
          <span>contact us.</span>
        </p>
      </header>
      <form
        className={classes.root + ' select-import-form-container'}
        noValidate
        autoComplete='off'
      >
        <div>
          <SelectFormContainer
            {...{
              selected: faculty,
              selections: faculties,
              handleSelection: onSelectFaculty,
              label: 'Faculty',
              helperText: 'Please Select a Faculty',
              valueText: 'FacultyNameInArabic',
              id: 'faculty',
            }}
          />

          <SelectFormContainer
            {...{
              selected: department,
              selections: departments,
              handleSelection: onSelectDepartment,
              label: 'Department',
              helperText: 'Please Select a Department',
              valueText: 'DepartmentNameInArabic',
              id: 'department',
            }}
          />

          <SelectFormContainer
            {...{
              selected: academicYear,
              selections: academicYears,
              handleSelection: onSelectAcademicYear,
              label: 'Academic Year',
              helperText: 'Please Select an Academic Year',
              valueText: 'AcademicYearInArabic',
              id: 'academic-year',
            }}
          />

          <SelectFormContainer
            {...{
              selected: term,
              selections: terms,
              handleSelection: onSelectTerm,
              label: 'Term',
              helperText: 'Please Select a Term',
              valueText: 'TermNumber',
              id: 'term',
            }}
          />
        </div>
      </form>
      {faculty && department && academicYear && term && courses.length > 0 && (
        <CoursesCardsContainer courses={courses} />
      )}
      {courses.length === 0 && (
        <div className='no-courses-img'>
          <img src={searching} alt='searching...' />
        </div>
      )}
    </main>
  );
};

export default AssignLecturersPage;
