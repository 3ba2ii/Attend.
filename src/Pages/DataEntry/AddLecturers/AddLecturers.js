import { useMutation, useQuery } from '@apollo/client';
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { CREATE_LECTURER_ACCOUNT } from '../../../api/mutations/createLecturer';
import { GET_USERNAMES_EMAILS } from '../../../api/queries/getOnlyUsernamesAndEmails';
import CustomizedSnackbars from '../../../components/Alerts/Alerts';
import LimitTags from '../../../components/AutoComplete/AutoCompleteLimiteTags';
import SpinnerElement from '../../../components/Spinner/spinner';
import { addLecturerPageStyles } from '../../../types/styles';
import CreateLecturerAccount from '../../../utlis/helpers/createLecturerAction';
import {
  validateArabicName,
  validateEnglishName,
} from '../../../utlis/validation/validation';
import './add_lecturers.css';

export default function AddLecturersPage() {
  const user = useSelector((state) => state?.authReducer?.authedUser);
  const { state } = useLocation();
  const classes = addLecturerPageStyles();
  const { loading, error, data } = useQuery(GET_USERNAMES_EMAILS);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameInEnglish, setNameInEnglish] = useState('');
  const [nameInArabic, setNameInArabic] = useState('');
  const [TeachingRole, setRole] = useState('');
  const [departments, setDepartments] = useState([]);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameInEnglishError, setNameInEnglishError] = useState(false);
  const [nameInArabicError, setNameInArabicError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  const [createLecturer] = useMutation(CREATE_LECTURER_ACCOUNT);

  const validateUsername = (e) => {
    setUsername(e.target.value);
    const found = data?.users.find((x) => x.username === e.target.value);
    if (found) setUsernameError(true);
    else {
      setUsernameError(false);
    }
  };
  const validateEmail = (e) => {
    setEmail(e.target.value);
    const found = data?.users.find((x) => x.email === e.target.value);
    if (found) setEmailError(true);
    else {
      setEmailError(false);
    }
  };
  const validatePassword = (e) => {
    setPassword(e.target.value);
  };
  const validateNameInEnglish = (e) => {
    setNameInEnglish(e.target.value);
    let isValid = validateEnglishName(e.target.value);
    if (!isValid) setNameInEnglishError(true);
    else setNameInEnglishError(false);
  };

  const validateNameInArabic = (e) => {
    setNameInArabic(e.target.value);
    let isValid = validateArabicName(e.target.value);
    if (!isValid) setNameInArabicError(true);
    else setNameInArabicError(false);
  };

  const onSelectRole = (e) => {
    setRole(e.target.value);
  };
  const onSelectDepartments = (e, value) => {
    setDepartments(value);
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    CreateLecturerAccount(
      {
        username,
        email,
        password,
        nameInEnglish,
        nameInArabic,
        departments,
        TeachingRole,
      },
      createLecturer,
      setSubmitLoading,
      setOpenSnackbar,
      setSnackbarType
    );
  };

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };
  if (user?.role?.name !== 'Super Admin') {
    return <Redirect to={state?.from || '/dashboard'} />;
  }

  if (loading)
    return (
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    );
  if (error) return `Error! ${error.message}`;
  return (
    <main id='add-lecturers-page'>
      <header className='import-students-header'>
        <h3>Add Lecturers 🧑‍🏫</h3>
        <p>
          Please fill out all the information required below to add the
          lecturers and assistants to the database so that they can sign-in
          later.
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
      <form
        className={classes.root}
        noValidate
        autoComplete='off'
        onSubmit={onSubmitCreate}
      >
        <div>
          <TextField
            required
            autoComplete='username'
            id='outlined-error-helper-text-username'
            label='Username'
            helperText={
              usernameError
                ? 'This username is already taken.'
                : 'Please select a unique username.'
            }
            variant='outlined'
            error={usernameError}
            onChange={validateUsername}
          />
          <TextField
            required
            type='email'
            autoComplete='email'
            id='outlined-error-helper-text-email'
            label='Email'
            helperText={
              emailError
                ? 'This email is already taken.'
                : 'Please select a unique email.'
            }
            variant='outlined'
            error={emailError}
            onChange={validateEmail}
          />
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoComplete='new-password'
          >
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              onChange={validatePassword}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    edge='end'
                  >
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
            <FormHelperText id='my-helper-text'>
              Make sure it's at least 8 characters including a number and a
              lowercase letter.
            </FormHelperText>
          </FormControl>
          <TextField
            required
            id='outlined-error-helper-text-english'
            label='Lecturer Name in English'
            helperText={
              nameInEnglishError
                ? 'The name should only include english characters.'
                : "Please type the lecturer's name (in English)."
            }
            variant='outlined'
            error={nameInEnglishError}
            onChange={validateNameInEnglish}
          />
          <TextField
            required
            id='outlined-error-helper-text-arabic'
            label='Lecturer Name in Arabic'
            onChange={validateNameInArabic}
            helperText={
              nameInArabicError
                ? 'The name should only include Arabic characters.'
                : "Please type the lecturer's name (in Arabic)."
            }
            variant='outlined'
            error={nameInArabicError}
          />
          <TextField
            id='filled-select-currency'
            select
            required
            label='Select Role'
            value={TeachingRole}
            onChange={onSelectRole}
            helperText='Please select a role for the lecturer'
            variant='outlined'
          >
            {[
              { label: 'Lecturer', value: 'lecturer' },
              { label: 'Teacher Assistant', value: 'TA' },
            ].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <LimitTags {...{ onSelectDepartments }} />
        </div>

        <div className='fixed-btn-bottom'>
          <Link className='cancel-btn' to={'/admin-panel'}>
            <span>Cancel</span>
          </Link>
          <button
            type='submit'
            className='submit-btn-container'
            disabled={
              !departments.length ||
              nameInEnglishError ||
              nameInArabicError ||
              usernameError ||
              emailError ||
              !nameInEnglish ||
              !nameInArabic ||
              !TeachingRole ||
              !password ||
              submitLoading
            }
          >
            {submitLoading ? (
              <div className='circular-progress-bar-container'>
                <CircularProgress color='inherit' size={24} />
              </div>
            ) : (
              <span className='animated-top-onhover'>
                <AddIcon size={24} />
              </span>
            )}
            <span>Create Lecturer</span>
          </button>
        </div>
      </form>
    </main>
  );
}
