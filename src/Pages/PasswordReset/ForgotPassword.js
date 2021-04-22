import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { FORGOT_PASSWORD_MUTATION } from 'api/mutations/forgotPassword';
import EmailDeliveredSVG from 'assets/clip-message-sent.svg';
import ForgotPasswordSVG from 'assets/robot-fail.svg';
import { Error } from 'components/common/ErrorIndicator';
import Logo from 'components/common/Logo';
import { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';
import './forgot-password.css';

const ForgotPasswordPage = () => {
  const email = useRef(null);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);
  const [error, setError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const ignoreError = () => {
    setError(false);
  };
  const handleForgotPasswordRequest = async (e) => {
    try {
      e.preventDefault();
      const {
        data: { forgotPassword: ok },
      } = await forgotPassword({
        variables: {
          email: email.current.value,
        },
      });

      if (ok) setEmailSent(true);
    } catch (e) {
      console.error(e.message);
      setError(true);
    }
  };

  useEffect(() => {
    document.title = 'Forgot Password | attend.';
  }, []);

  if (redirectToLogin) {
    return <Redirect to={'/login'} />;
  }
  return (
    <main id='forgot-password-page'>
      <Logo className='small-logo' />
      {emailSent ? (
        <section
          className='forgot-password-container'
          style={{ width: '450px', maxWidth: '450px' }}
        >
          <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <img src={EmailDeliveredSVG} alt={'forgot-password'} />
          </div>
          <label htmlFor='email_field' id='mail-field-label'>
            Check your email for a link to reset your password. If it doesn’t
            appear within a few minutes, check your spam folder.
          </label>
          <button
            className='return-to-sign-in-btn'
            onClick={() => {
              setRedirectToLogin(true);
            }}
          >
            <span>Return to sign in</span>
          </button>
        </section>
      ) : (
        <section className='forgot-password-container'>
          <header>
            <h5 className='reset-password-title'> Reset your password</h5>
            <div
              style={{
                marginBottom: '1rem',
                marginTop: '1rem',
                marginLeft: '1rem',
              }}
            >
              <img src={ForgotPasswordSVG} alt={'forgot-password'} />
            </div>

            {error && (
              <Error
                ignoreError={ignoreError}
                message={
                  'This email is wrong or not associated with any account.'
                }
              />
            )}
            <form onSubmit={handleForgotPasswordRequest}>
              <label htmlFor='email_field' id='mail-field-label'>
                Enter your user account's email address and we will send you a
                password reset link.
              </label>

              <TextField
                inputProps={{
                  autoComplete: 'new-password',
                  form: {
                    autoComplete: 'off',
                  },
                }}
                size={'small'}
                type='email'
                label={'Email Address'}
                variant={'outlined'}
                inputRef={email}
                autoFocus
                id='reset-password-email-field'
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    handleForgotPasswordRequest(ev);
                  }
                }}
              />

              <button
                type='submit'
                className='reset-password-btn'
                disabled={loading}
              >
                <span>Send password reset email</span>
              </button>
            </form>
          </header>
        </section>
      )}
    </main>
  );
};

export default ForgotPasswordPage;
