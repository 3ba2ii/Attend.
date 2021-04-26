import { useMutation } from '@apollo/client';
import { MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {
  CREATE_INVITATION,
  UPDATE_INVITATION_DATE,
} from 'api/mutations/createInvitation';
import { GET_USER_INVITATION_WITH_EMAIL } from 'api/queries/getInvitationWithEmail';
import React, { useState } from 'react';
import client from 'utlis/apollo/apolloClient';
import { sendInvitationEmail } from './sendInvitationEmail';

export function InvitationForm({
  roles,
  departments,
  currentUsersEmail,
  LecturerNameInEnglish,
  id,
}) {
  const [email, setEmail] = useState(null);
  const [selectedRole, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [createInvitation, { loading }] = useMutation(CREATE_INVITATION);
  const [updateInvitationDate, { loading: updateLoading }] = useMutation(
    UPDATE_INVITATION_DATE
  );

  const validateEmail = () => {
    if (currentUsersEmail.includes(email)) {
      setEmailError(true);
    }
  };

  const onSelectRole = ({ id, children }) => {
    if (id && children) {
      setRole(id);
      setRoleName(children.props.children);
    }
  };
  const onSelectDepartment = ({ id, children }) => {
    if (id && children) {
      setDepartment(id);
      setDepartmentName(children.props.children);
    }
  };
  const onSubmitInvitationForm = async (e) => {
    e.preventDefault();
    if (emailError) return;
    try {
      let tokenID;
      const {
        data: { userInvitations },
      } = await client.query({
        query: GET_USER_INVITATION_WITH_EMAIL,
        variables: {
          email,
        },
      });

      if (!userInvitations.length) {
        const {
          data: {
            createUserInvitation: {
              userInvitation: { id: invitationID },
            },
          },
        } = await createInvitation({
          variables: {
            email,
            role: selectedRole,
            user: id,
            department,
            latest_invitation_time: new Date(),
          },
        });
        tokenID = invitationID;
      } else {
        if (userInvitations[0].isUsed) {
          console.log('Not Valid');
          return;
        }
        tokenID = userInvitations[0].id;
        updateInvitationDate({
          variables: {
            id: tokenID,
            latest_invitation_time: new Date(),
            department,
            role: selectedRole,
            user: id,
          },
        });
      }

      sendInvitationEmail({
        email,
        token: tokenID,
        department: departmentName,
        teaching_role: roleName,
        name: LecturerNameInEnglish,
        prefix: 'Dr. ',
      });
    } catch (e) {
      console.error(e.message);
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
          onChange={(e, children) =>
            onSelectRole({ id: e.target.value, children })
          }
        >
          {roles.map(({ id, name, type }) => {
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
          onChange={(e, children) =>
            onSelectDepartment({ id: e.target.value, children })
          }
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
