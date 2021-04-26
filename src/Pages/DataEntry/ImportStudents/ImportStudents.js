import { useMutation } from '@apollo/client';
import { CREATE_STUDENT } from 'api/mutations/createStudent';
import { GET_FACULTY_DATA } from 'api/queries/getFacultyData';
import excelFileScreenshot from 'assets/excelsheet.png';
import CustomizedSnackbars from 'components/Alerts/Alerts';
import TransitionsModal from 'components/Modals/FormatModal';
import UploadedGroupsModal from 'components/Modals/UploadedGroupsModal';
import Query from 'components/Query';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { importFormsStyles } from 'types/styles';
import { createStudentHelperFunction } from 'utlis/helpers/createStudentHelperFunction';
import { handleChangesAndReturnNextState } from 'utlis/helpers/handleChangesAndReturnNextState';
import { SelectFormContainer } from '../AdminPanel/SelectFormContainer';
import DropzoneContainer from './Dropzone';
import './import_student.css';

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
  const [createStudent, { loading }] = useMutation(CREATE_STUDENT);
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
        setOpenSnackbar,
        setSnackbarType,
      });
    },
    [createStudent, studentsFile, group, setOpenSnackbar, setSnackbarType]
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
    <main id='import-student-for-container'>
      <Query query={GET_FACULTY_DATA} onCompletedFunction={fetchFaculties}>
        {() => (
          <>
            <header className='import-students-header'>
              <h4 className='font-weight600'>Import Students 🧑🏼‍🎓</h4>

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
                setFile={setStudentsFile}
                propsToCheck={'student-import'}
                fileFormatError={fileFormatError}
                setFileFormatError={setFileFormatError}
              />
              <div
                className='show-formation-of-excel-file'
                onClick={handleOpen}
              >
                How to format the excel file?
              </div>
              <div className='upload-btn-container'>
                <Link className='cancel-btn' to={'/admin-panel'}>
                  <span>Back</span>
                </Link>

                <button
                  className='upload-students-btn'
                  type='submit'
                  disabled={
                    fileFormatError ||
                    !studentsFile ||
                    !group ||
                    !academicYear ||
                    !department ||
                    !faculty ||
                    loading
                  }
                >
                  <span>Upload</span>
                </button>
              </div>
            </form>
            <TransitionsModal
              handleClose={handleClose}
              handleOpen={handleOpen}
              open={openFormationModal}
              description={
                <>
                  Please format the excel file to only include these following
                  headers <br />
                  <b> 'اسم الطالب ,الرقم القومي ,الايميل, ID' </b>to allow the
                  system to store the data in a correct way.
                </>
              }
              title={'How to format the excel file?'}
              exampleImage={
                <img
                  src={excelFileScreenshot}
                  alt={'excel-sheet'}
                  className='excel-sheet-screenshot'
                />
              }
            />
            {openGroupsModal && (
              <UploadedGroupsModal
                handleClose={handleCloseGroupModal}
                handleOpen={handleOpenGroupModal}
                open={openGroupsModal}
              />
            )}
          </>
        )}
      </Query>
    </main>
  );
};

export default ImportStudentContainer;
