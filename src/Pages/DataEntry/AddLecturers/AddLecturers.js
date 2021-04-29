import { GET_USERNAMES_EMAILS } from 'api/queries/getOnlyUsernamesAndEmails';
import CustomizedSnackbars from 'components/Alerts/Alerts';
import Query from 'components/Query';
import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import './add_lecturers.css';
import { DropZone } from './UsersInviationsDropZone';
import { InvitationForm } from './InvitationForm';
import './styled-table.css';

export default function AddLecturersPage() {
  const {
    authedUser: { LecturerNameInEnglish, role, id },
  } = useSelector((state) => state?.authReducer);

  const { state } = useLocation();
  const [currentUsersEmail, setCurrentUsersEmails] = useState([]);
  const methodRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');
  const [checkedMethod, setCheckedMethod] = useState(null);

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };
  const scrollInto = (ref) => {
    try {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleChangeMethod = (pathTo) => {
    if (pathTo) {
      setCheckedMethod(pathTo);
      scrollInto(methodRef);
    }
  };
  const fetchUsers = useCallback(
    ({ users }) => {
      setCurrentUsersEmails(users.map((u) => u.email));
    },
    [setCurrentUsersEmails]
  );

  if (role?.name !== 'Super Admin') {
    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <Query query={GET_USERNAMES_EMAILS} onCompletedFunction={fetchUsers}>
      {({ data: { roles, departments, userInvitations } }) => {
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
                    ? `Invitations Sent Successfully!`
                    : 'There was an error sending these invitations, Please try again later!',
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
                    handleChangeMethod('manually');
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
                    handleChangeMethod('excel-sheet');
                  }}
                >
                  <span className='checkbox-input' />
                  <div className='icons8-check-document' />
                  <span className='font-weight500'>Excel Sheet</span>
                </div>
              </div>
            </section>
            <section className='main-content'>
              <div ref={methodRef}>
                {checkedMethod === 'manually' && (
                  <InvitationForm
                    {...{
                      roles,
                      departments,
                      currentUsersEmail,
                      userInvitations,
                      setOpenSnackbar,
                      setSnackbarType,
                    }}
                  />
                )}
                {checkedMethod === 'excel-sheet' && (
                  <DropZone
                    {...{
                      departments,
                      currentUsersEmail,
                      roles,
                      userInvitations,
                      setOpenSnackbar,
                      setSnackbarType,
                    }}
                  />
                )}
              </div>
            </section>
          </main>
        );
      }}
    </Query>
  );
}
