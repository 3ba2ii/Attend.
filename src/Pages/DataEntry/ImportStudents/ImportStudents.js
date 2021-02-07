import { useQuery } from '@apollo/client';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { GET_FACULTY_DATA } from '../../../api/queries/getFacultyData';
import Spinner from '../../../assets/spinner.gif';
import { useStyles } from '../../../types/styles/ImportFormsStyles';
import { handleChangesAndReturnNextState } from '../../../utlis/helpers/handleChangesAndReturnNextState';
import { SelectFormContainer } from '../SelectFormContainer';
import DropzoneContainer from './Dropzone';
import TransitionsModal from './FormatModal';
import './import_student.css';

const ImportStudentContainer = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_FACULTY_DATA);
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [group, setGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [studentsFile, setStudentsFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileFormatError, setFileFormatError] = useState(null);
  const { state } = useLocation();

  const user = useSelector((state) => state?.authReducer?.authedUser);

  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }

  const faculties = data?.faculties;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      setAcademicYears,
      departments,
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
  };
  const onUploadData = (e) => {
    e.preventDefault();
  };
  if (loading)
    return (
      <div className='loading-spinner-gif'>
        <img src={Spinner} alt='loading' />
      </div>
    );
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
        onSubmit={onUploadData}
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
              valueText: 'YearNumber',
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

        <DropzoneContainer
          setStudentsFile={setStudentsFile}
          fileFormatError={fileFormatError}
          setFileFormatError={setFileFormatError}
        />
        <div className='show-formation-of-excel-file' onClick={handleOpen}>
          Show how the Excel File should be formatted?
        </div>
        <div className='fixed-btn-bottom'>
          <Link className='cancel-btn' to={'/data_entry'}>
            <span>Cancel</span>
          </Link>
          <button
            type='submit'
            className='submit-btn-container'
            disabled={
              fileFormatError ||
              !studentsFile ||
              !group ||
              !academicYear ||
              !department ||
              !faculty
            }
          >
            <span className='animated-top-onhover'>
              <ArrowUpwardIcon />
            </span>
            <span>Upload</span>
          </button>
        </div>
      </form>
      <TransitionsModal
        handleClose={handleClose}
        handleOpen={handleOpen}
        open={open}
      />
    </main>
  );
};

export default ImportStudentContainer;
