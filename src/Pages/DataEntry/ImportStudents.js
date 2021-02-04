import { useQuery, useEffect } from '@apollo/client';
import { MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { GET_FACULTY_DATA } from '../../api/queries/getFacultyData';
import { LoadingSpinner } from '../Login/LoadingSpinner';
import './import_student.css';
import { SelectFormContainer } from './SelectFormContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(2, 2, 2, 0),
        width: '65ch',
      },
    },
  },
}));
const ImportStudentContainer = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_FACULTY_DATA);
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  const [major, setMajor] = useState('');

  const [majors, setMajors] = useState([]);

  const [academicYear, setAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);

  const [group, setGroup] = useState('');
  const [groups, setGroups] = useState([]);

  const faculties = data?.faculties;

  const onSelectFaculty = (e) =>
    handleChangesAndReturnNextState(
      e,
      setFaculty,
      setDepartments,
      faculties,
      'departments'
    );
  const onSelectDepartment = (e) =>
    handleChangesAndReturnNextState(
      e,
      setDepartment,
      setMajors,
      departments,
      'majors'
    );
  const onSelectMajor = (e) =>
    handleChangesAndReturnNextState(
      e,
      setMajor,
      setAcademicYears,
      majors,
      'academic_years'
    );

  const onSelectAcademicYear = (e) =>
    handleChangesAndReturnNextState(
      e,
      setAcademicYear,
      setGroups,
      academicYears,
      'groups'
    );

  const onSelectGroup = (e) => {
    setGroup(e.target.value);
    console.log('hehehe');
  };
  if (loading) return <LoadingSpinner />;
  if (error) return `Error! ${error.message}`;

  return (
    <main id='import-student-for-container'>
      <header className='import-students-header'>
        <h3>Import Students 🧑🏼‍🎓</h3>
        <p>
          Please fill out all the information required below to upload the
          students to the database.
          <br />
          <span>Show uploaded groups</span>
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
              valueText: 'FacultyNameInEnglish',
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
              valueText: 'DepartmentNameInEnglish',
              id: 'department',
            }}
          />
          <SelectFormContainer
            {...{
              selected: major,
              selections: majors,
              handleSelection: onSelectMajor,
              label: 'Major',
              helperText: 'Please Select a Major',
              valueText: 'MajorNameInEnglish',
              id: 'major',
            }}
          />
          <SelectFormContainer
            {...{
              selected: academicYear,
              selections: academicYears,
              handleSelection: onSelectAcademicYear,
              label: 'Academic Year',
              helperText: 'Please Select an Academic Year',
              valueText: 'AcademicYearInEnglish',
              id: 'academic-year',
            }}
          />
          <SelectFormContainer
            {...{
              selected: group,
              selections: groups,
              handleSelection: onSelectGroup,
              label: 'Group',
              helperText:
                'Please Select a Group; if none select the first group',
              valueText: 'GroupNumber',
              id: 'group',
            }}
          />
        </div>
      </form>
    </main>
  );
};

export default ImportStudentContainer;

const handleChangesAndReturnNextState = (
  e,
  handleCurrentState,
  handeNextState,
  data,
  neededField
) => {
  handleCurrentState(e.target.value);
  const selectedData = data.filter((x) => x.id === e.target.value);
  handeNextState(selectedData[0][neededField]);
};
