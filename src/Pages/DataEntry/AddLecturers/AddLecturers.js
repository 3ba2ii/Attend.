import { GET_USERNAMES_EMAILS } from 'api/queries/getOnlyUsernamesAndEmails';
import excelFileScreenshot from 'assets/excelsheet.png';
import CustomizedSnackbars from 'components/Alerts/Alerts';
import TransitionsModal from 'components/Modals/FormatModal';
import Query from 'components/Query';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import DropzoneContainer from '../ImportStudents/Dropzone';
import './add_lecturers.css';
import { InvitationForm } from './InvitationForm';

export default function AddLecturersPage() {
  const {
    authedUser: { LecturerNameInEnglish, role, id },
  } = useSelector((state) => state?.authReducer);

  const { state } = useLocation();
  const [currentUsersEmail, setCurrentUsersEmails] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  const [checkedMethod, setCheckedMethod] = useState(null);

  /* setFile,
  setFileFormatError,
  fileFormatError,
  propsToCheck, */

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const fetchUsers = useCallback(
    ({ users, departments, roles }) => {
      setCurrentUsersEmails(users.map((u) => u.email));
    },
    [setCurrentUsersEmails]
  );
  if (role?.name !== 'Super Admin') {
    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <Query query={GET_USERNAMES_EMAILS} onCompletedFunction={fetchUsers}>
      {({ data: { roles, departments } }) => {
        return (
          <main id='add-lecturers-page'>
            <header className='import-students-header'>
              <h4 className='font-weight600'>Invite Lecturers and TAs 🧑‍🏫</h4>

              <p>
                Fill the information below to send invitations for the users so
                that they can register.
                <br />
              </p>
            </header>
            <CustomizedSnackbars
              {...{
                open: openSnackbar,
                type: snackbarType || 'error',
                message:
                  snackbarType === 'success'
                    ? `A new account has been created successfully! `
                    : 'There was an error creating this account, Please try again later! ',
                handleClose,
              }}
            />
            <section className='add-lecturer-method'>
              <h3>How do you want to send invitations?</h3>
              <div className='methods-checkbox-container'>
                <div
                  className={`method-check-box ${
                    checkedMethod === 'manually' && 'active-checkbox'
                  }`}
                  type='checkbox'
                  onClick={() => {
                    setCheckedMethod('manually');
                  }}
                >
                  <span className='checkbox-input' />
                  <div className='icons8-ball-point-pen' />
                  <span className='font-weight500'>Manually</span>
                </div>
                <div
                  className={`method-check-box ${
                    checkedMethod === 'excel-sheet' && 'active-checkbox'
                  }`}
                  type='checkbox'
                  onClick={() => {
                    setCheckedMethod('excel-sheet');
                  }}
                >
                  <span className='checkbox-input' />
                  <div className='icons8-check-document' />
                  <span className='font-weight500'>Excel Sheet</span>
                </div>
              </div>
            </section>
            <section className='main-content'>
              <>
                {checkedMethod === 'manually' && (
                  <InvitationForm
                    {...{
                      roles,
                      departments,
                      currentUsersEmail,
                      LecturerNameInEnglish,
                      id,
                    }}
                  />
                )}
                {checkedMethod === 'excel-sheet' && <DropZone />}
              </>
            </section>
          </main>
        );
      }}
    </Query>
  );
}
function DropZone() {
  const [openModal, setOpenModal] = useState(false);
  const [xlsxFile, setFile] = useState(null);
  const [fileFormatError, setFileFormatError] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section className='form-excel-wrapper'>
      <div style={{ width: '400px' }}>
        <TransitionsModal
          handleClose={handleClose}
          open={openModal}
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
      </div>
      <div className='form-uploader-xlsx-container'>
        <header>
          <h3>Format the excel file correctly and upload it</h3>
          <span
            className='show-formation-of-excel-file'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            How to format the excel file?
          </span>
        </header>
        <DropzoneContainer
          {...{
            setFile,
            setFileFormatError,
            fileFormatError,
            propsToCheck: 'department uploader',
          }}
        />
      </div>
    </section>
  );
}
