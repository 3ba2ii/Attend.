import { useCallback, useState } from 'react';
import { GET_COURSES_INFO } from 'api/queries/getCoursesInfo';
import searching from 'assets/searching.png';
import CoursesCardsContainer from 'components/CoursesCards/CoursesCardsContainer';
import Query from 'components/Query';
import { AssignLecturersPageStyles } from 'types/styles';
import { handleChangesAndReturnNextState } from 'utlis/helpers/handleChangesAndReturnNextState';
import { SelectFormContainer } from '../AdminPanel/SelectFormContainer';
import './assign-lecturers.css';

const AssignLecturersPage = () => {
  const classes = AssignLecturersPageStyles();
  const [faculties, setFaculties] = useState([]);
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

  return (
    <Query
      query={GET_COURSES_INFO}
      onCompletedFunction={(data) => setFaculties(data?.faculties || [])}
    >
      {({ data }) => {
        return (
          <main id='assign-lecturers-page'>
            <header>
              <h4>
                Please fill the following fields to show the associated courses.
              </h4>
              <p>
                If the desired course is not displayed, Please{' '}
                <a href={'mailto:aghonem2011@gmail.com'}>contact us.</a>
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
            {faculty &&
              department &&
              academicYear &&
              term &&
              courses.length > 0 && <CoursesCardsContainer courses={courses} />}
            {courses.length === 0 && (
              <div className='no-courses-img'>
                <img src={searching} alt='searching...' />
              </div>
            )}
          </main>
        );
      }}
    </Query>
  );
};

export default AssignLecturersPage;
