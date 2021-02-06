import { useQuery } from '@apollo/client';
import { IconButton } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useState } from 'react';
import { GET_USERNAMES_EMAILS } from '../../../api/queries/getOnlyUsernamesAndEmails';
import Spinner from '../../../assets/spinner.gif';
import {
  validateArabicName,
  validateEnglishName,
} from '../../../utlis/validation/validation';
import './add_lecturers.css';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),

    '& .MuiTextField-root': {
      width: '100%',
      margin: theme.spacing(2, 2, 2, 0),

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(1.5, 5, 2, 0),
        width: '50ch',
      },
      [theme.breakpoints.up('lg')]: {
        width: '60ch',
      },
      [theme.breakpoints.up('xl')]: {
        width: '80ch',
      },
    },
    margin: {
      margin: theme.spacing(10),
    },
    withoutLabel: {
      marginTop: theme.spacing(30),
    },
  },
  textField: {
    width: '100%',
    margin: theme.spacing(2, 2, 2, 0),

    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(1.5, 5, 2, 0),
      width: '50ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '60ch',
    },
    [theme.breakpoints.up('xl')]: {
      width: '80ch',
    },
  },
}));

export default function AddLecturersPage() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_USERNAMES_EMAILS);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameInEnglish, setNameInEnglish] = useState('');
  const [nameInArabic, setNameInArabic] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameInEnglishError, setNameInEnglishError] = useState(false);
  const [nameInArabicError, setNameInArabicError] = useState(false);

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

  if (loading)
    return (
      <div className='loading-spinner-gif'>
        <img src={Spinner} alt='loading' />
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
      <form className={classes.root} noValidate autoComplete='off'>
        <div>
          <TextField
            required
            autoComplete='off'
            id='outlined-error-helper-text'
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
            id='outlined-error-helper-text'
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
          <FormControl className={classes.textField} variant='outlined'>
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
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
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
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
        </div>
      </form>
    </main>
  );
}
