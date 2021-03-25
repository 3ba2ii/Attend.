import { useMutation } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { CREATE_STUDENT } from 'api/mutations/createStudent';
import { GET_FACULTY_DATA } from 'api/queries/getFacultyData';
import CustomizedSnackbars from 'components/Alerts/Alerts';
import Query from 'components/Query';
import { importFormsStyles } from 'types/styles';
import { createStudentHelperFunction } from 'utlis/helpers/createStudentHelperFunction';
import { handleChangesAndReturnNextState } from 'utlis/helpers/handleChangesAndReturnNextState';
import { SelectFormContainer } from '../AdminPanel/SelectFormContainer';
import DropzoneContainer from './Dropzone';
import TransitionsModal from './FormatModal';
import './import_student.css';
import UploadedGroupsModal from './UploadedGroupsModal';

const ImportStudentContainer = () => {
  const classes = importFormsStyles();
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [group, setGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [studentsFile, setStudentsFile] = useState(null);
  const [fileFormatError, setFileFormatError] = useState(null);
  const [openFormationModal, setOpenFormationModal] = useState(false);
  const [openGroupsModal, setOpenGroupsModal] = useState(false);
  const [createStudent] = useMutation(CREATE_STUDENT);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');
  const { state } = useLocation();
  const user = useSelector((state) => state?.authReducer?.authedUser);

  const handleOpen = useCallback(() => {
    setOpenFormationModal(true);
  }, [setOpenFormationModal]);

  const handleClose = useCallback(() => {
    setOpenFormationModal(false);
  }, [setOpenFormationModal]);

  const handleOpenGroupModal = useCallback(() => {
    setOpenGroupsModal(true);
  }, [setOpenGroupsModal]);

  const handleCloseGroupModal = useCallback(() => {
    setOpenGroupsModal(false);
  }, [setOpenGroupsModal]);

  const onSelectFaculty = useCallback(
    (e) =>
      handleChangesAndReturnNextState(
        e,
        setFaculty,
        setDepartments,
        faculties,
        'departments'
      ),
    [faculties]
  );
  const onSelectDepartment = useCallback(
    (e) =>
      handleChangesAndReturnNextState(
        e,
        setDepartment,
        setAcademicYears,
        departments,
        'academic_years'
      ),
    [departments]
  );

  const onSelectAcademicYear = useCallback(
    (e) =>
      handleChangesAndReturnNextState(
        e,
        setAcademicYear,
        setGroups,
        academicYears,
        'groups'
      ),
    [academicYears]
  );

  const onSelectGroup = useCallback(
    (e) => {
      setGroup(e.target.value);
    },
    [setGroup]
  );
  const handleCloseToaster = useCallback(
    (e, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    },
    [setOpenSnackbar]
  );
  const onUploadData = useCallback(
    (e) => {
      e.preventDefault();
      createStudentHelperFunction({
        createStudent,
        studentsFile,
        group,
        setUploadLoading,
        setOpenSnackbar,
        setSnackbarType,
      });
    },
    [
      createStudent,
      studentsFile,
      group,
      setUploadLoading,
      setOpenSnackbar,
      setSnackbarType,
    ]
  );
  const fetchFaculties = useCallback(
    (data) => setFaculties(data?.faculties || []),
    [setFaculties]
  );

  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <Query query={GET_FACULTY_DATA} onCompletedFunction={fetchFaculties}>
      {() => (
        <main id='import-student-for-container'>
          <header className='import-students-header'>
            <h3>Import Students 🧑🏼‍🎓</h3>
            <p>
              Please fill out all the information required below to upload the
              students to the database.
              <br />
              <span onClick={handleOpenGroupModal}>Show uploaded groups</span>
            </p>
          </header>
          <CustomizedSnackbars
            {...{
              open: openSnackbar,
              type: snackbarType || 'error',
              message:
                snackbarType === 'success'
                  ? `Imported ${
                      studentsFile?.length || ''
                    } Students Successfully!`
                  : 'There was an error uploading this students file, Please try again later! ',
              handleClose: handleCloseToaster,
            }}
          />
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
                  valueText: 'AcademicYearInArabic',
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
              <Link className='cancel-btn' to={'/admin-panel'}>
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
                {uploadLoading ? (
                  <div className='circular-progress-bar-container'>
                    <CircularProgress color='inherit' size={24} />
                  </div>
                ) : (
                  <span className='animated-top-onhover'>
                    <ArrowUpwardIcon size={24} />
                  </span>
                )}

                <span>Upload</span>
              </button>
            </div>
          </form>
          <TransitionsModal
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={openFormationModal}
          />
          {openGroupsModal && (
            <UploadedGroupsModal
              handleClose={handleCloseGroupModal}
              handleOpen={handleOpenGroupModal}
              open={openGroupsModal}
            />
          )}
        </main>
      )}
    </Query>
  );
};

export default ImportStudentContainer;
