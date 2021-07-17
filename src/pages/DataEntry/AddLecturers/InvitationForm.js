import { useMutation } from '@apollo/client';
import { MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {
  CREATE_INVITATION,
  UPDATE_INVITATION_DATE,
} from 'api/mutations/createInvitation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleSubmitInvitationForm } from 'utlis/helpers/invtiationOperations/invitationOperations';

export function InvitationForm({
  roles,
  departments,
  currentUsersEmail,
  userInvitations,
  setOpenSnackbar,
  setSnackbarType,
}) {
  const {
    authedUser: { LecturerNameInEnglish, id },
  } = useSelector((state) => state?.authReducer);

  const [email, setEmail] = useState(null);
  const [selectedRole, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [createInvitation, { loading }] = useMutation(CREATE_INVITATION);
  const [updateInvitationDate, { loading: updateLoading }] = useMutation(
    UPDATE_INVITATION_DATE
  );

  const validateEmail = () => {
    if (currentUsersEmail.includes(email)) {
      setEmailError(true);
    }
  };

  const onSelectRole = (e) => {
    setRole(e.target.value);
  };
  const onSelectDepartment = (e) => {
    setDepartment(e.target.value);
  };
  const onSubmitInvitationForm = async (e) => {
    e.preventDefault();

    if (emailError) return;
    try {
      await handleSubmitInvitationForm({
        departments,
        roles,
        department,
        email,
        selectedRole,
        userInvitations,
        userID: id,
        LecturerNameInEnglish,
        createInvitation,
        updateInvitationDate,
        setOpenSnackbar,
        setSnackbarType,
      });

      setSnackbarType('success');
    } catch (e) {
      console.error(e.message);
      setSnackbarType('error');
    } finally {
      setOpenSnackbar(true);
    }
  };
  return (
    <div className='add-lecturer-manually-container'>
      <header>
        <h3>Fill the following form and click send</h3>
      </header>
      <form
        className='add-lecturer-form'
        autoComplete='off'
        onSubmit={onSubmitInvitationForm}
      >
        <TextField
          required
          type='email'
          autoComplete='email'
          id='outlined-error-helper-text-email'
          label='Email'
          helperText={
            emailError
              ? 'This email is already associated with an account.'
              : ''
          }
          variant='outlined'
          error={emailError}
          onChange={(e) => {
            setEmailError(false);
            setEmail(e.target.value);
          }}
          onBlur={validateEmail}
        />

        <TextField
          id='filled-select-currency'
          select
          required
          label='Role'
          value={selectedRole}
          onChange={onSelectRole}
          variant='outlined'
        >
          {roles.map(({ id, name }) => {
            return (
              ['Lecturer', 'Teacher Assistant'].includes(name) && (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              )
            );
          })}
        </TextField>
        <TextField
          id='filled-select-currency'
          select
          required
          label='Department'
          value={department}
          onChange={onSelectDepartment}
          variant='outlined'
        >
          {departments.map(({ id, DepartmentNameInEnglish }) => (
            <MenuItem key={id} value={id}>
              {DepartmentNameInEnglish}
            </MenuItem>
          ))}
        </TextField>
        <div className='invitation-btn-container'>
          <button
            type='submit'
            className='invitation-btn'
            disabled={loading || emailError || updateLoading}
          >
            <span>Send Invitation</span>
          </button>
        </div>
      </form>
    </div>
  );
}
