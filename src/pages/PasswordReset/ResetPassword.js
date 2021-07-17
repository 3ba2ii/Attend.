import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { RESET_PASSWORD_MUTATION } from 'api/mutations/resetPasswordMutation';
import { Error } from 'components/common/ErrorIndicator';
import Logo from 'components/common/Logo';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import './reset-password.css';
import './forgot-password.css';

const ResetPasswordPage = () => {
  let { code } = useParams();

  const [password, setPassword] = useState(null);
  const [passwordConfirmation, setPasswordConfirm] = useState(null);
  const [notLongEnough, setNotLongEnough] = useState(false);
  const [notEqual, setNotEqual] = useState(false);
  const [error, setError] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleChangePasswordConfirmation = (e) => {
    setPasswordConfirm(e.target.value);
  };
  const validateOriginalPassword = () => {
    if (!password) {
      setNotLongEnough(false);
      return;
    }
    if (password.length < 8) {
      setNotLongEnough(true);
      return;
    }
    setNotLongEnough(false);
  };
  const validatePasswords = () => {
    if (password !== passwordConfirmation) {
      setNotEqual(true);
      return false;
    }
    setNotEqual(false);
    return true;
  };

  const ignoreError = () => {
    setError(false);
  };
  const handleSubmitChangePassword = async (e) => {
    try {
      e.preventDefault();
      const validCode = code.split('code=')[1];
      const {
        data: {
          resetPassword: { user },
        },
      } = await resetPassword({
        variables: {
          code: validCode,
          password,
          passwordConfirmation,
        },
      });
      if (user) setPasswordChanged(true);
    } catch (e) {
      console.error(e);
      setError(true);
    }
  };
  useEffect(() => {
    document.title = 'Create New Password | attend.';
  }, []);
  if (!code)
    return (
      <main id='no-code-provided'>
        This code is not valid, please try again later
      </main>
    );
  if (redirectToLogin) {
    return <Redirect to={'/login'} />;
  }
  return (
    <main id='reset-password-page'>
      <Logo className='small-logo' />

      <section className='forgot-password-container'>
        {passwordChanged ? (
          <div className='password-changed-successfully'>
            <h1>🎉</h1>
            <label style={{ textAlign: 'center' }} id='mail-field-label'>
              Your password has been changed successfully, you can now login
              with your new password.
            </label>
            <button
              className='return-to-sign-in-btn'
              onClick={() => {
                setRedirectToLogin(true);
              }}
            >
              <span>Return to sign in</span>
            </button>
          </div>
        ) : (
          <>
            <header>
              <h5 className='reset-password-title'> Create New Password</h5>
              <div
                style={{
                  marginBottom: '1rem',
                  marginTop: '1rem',
                  marginLeft: '1rem',
                }}
              />

              {error && (
                <Error
                  ignoreError={ignoreError}
                  message={
                    'An error occurred while changing your password, Please try again.'
                  }
                />
              )}
            </header>
            <form
              className='new-password-form'
              onSubmit={handleSubmitChangePassword}
            >
              <label htmlFor='new-password-field' id='mail-field-label'>
                Your new password must be different from your previous used
                passwords.
              </label>

              <TextField
                value={!password ? '' : password}
                inputProps={{
                  autoComplete: 'new-password',
                  form: {
                    autoComplete: 'new-password',
                  },
                }}
                size={'small'}
                type='password'
                label={'Password'}
                variant={'outlined'}
                error={notEqual || notLongEnough}
                helperText={'Must be at least 8 characters'}
                onChange={handleChangePassword}
                autoFocus
                fullWidth
                onBlur={validateOriginalPassword}
                id='new-password-field'
              />
              <TextField
                value={!passwordConfirmation ? '' : passwordConfirmation}
                inputProps={{
                  autoComplete: 'new-password',
                  form: {
                    autoComplete: 'new-password',
                  },
                }}
                size={'small'}
                type='password'
                error={notEqual}
                helperText={
                  notEqual
                    ? 'Passwords do not match!'
                    : 'Both passwords must match'
                }
                label={'Confirm Password'}
                variant={'outlined'}
                onChange={handleChangePasswordConfirmation}
                fullWidth
                onBlur={validatePasswords}
                id='new-password-confirm-field'
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    handleSubmitChangePassword(ev);
                  }
                }}
              />
              <button className='return-to-sign-in-btn' disabled={loading}>
                <span>Change Password</span>
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};
export default ResetPasswordPage;
