import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { LOGIN } from 'api/mutations/login';
import { Error } from 'components/common/ErrorIndicator';
import Logo from 'components/common/Logo';
import PasswordTextField from 'components/common/PasswordTextField';
import SpinnerElement from 'components/Spinner/spinner';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { LoginAction } from 'redux/actions/authedAction';
import { FAILED_AUTHENTICATION } from 'types/constants/redux-constants';
import { checkCookies } from 'utlis/helpers/checkCookies';
import './login.css';

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const identifier = useRef(null);
  const password = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [checkingCookiesLoading, setCheckingCookiesLoading] = useState(true);
  const [loginMutation] = useMutation(LOGIN);

  const onLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const action = await LoginAction({
        identifier: identifier?.current?.value,
        password: password?.current?.value,
        LoginMutation: loginMutation,
      });
      if (action.type === FAILED_AUTHENTICATION) {
        setError(true);
      } else {
        dispatch(action);
        setRedirectToReferrer(true);
      }
      setLoading(false);
    },
    [dispatch, setLoading, setRedirectToReferrer, setError, loginMutation]
  );

  const ignoreError = useCallback(() => {
    setError(false);
  }, []);

  useEffect(() => {
    document.title = 'Attend. | Sign in';

    try {
      const token = Cookies.get('token');
      const userID = Cookies.get('authedUser');
      if (token && userID && !mounted) {
        checkCookies({
          dispatch,
          setLoading,
          setRedirectToReferrer,
          setCheckingCookiesLoading,
          token,
          userID,
        });
      } else {
        setCheckingCookiesLoading(false);
      }
    } catch (e) {
      console.error(e.message);
    }
    return () => {
      setMounted(true);
    };
  }, [dispatch, mounted]);

  if (redirectToReferrer) {
    return <Redirect to={state?.from || '/dashboard'} />;
  }
  if (checkingCookiesLoading) {
    return (
      <div className='center-spinner full-height'>
        <SpinnerElement />
      </div>
    );
  }
  return (
    <main className='login-grid-container'>
      <section className='login-form-container'>
        <div className='login-page-logo'>
          <Logo className='login-logo' />
        </div>
        <div className='loginForm'>
          <header className='login-header'>
            <h3>Sign in</h3>
            <span className='sign-in-paragraph'>
              Save time, store attendance, and make reports.
            </span>
          </header>
          {error && (
            <Error
              ignoreError={ignoreError}
              message={'Incorrect username or password.'}
            />
          )}
          <form onSubmit={onLogin} className='login-form'>
            <input name='utf8' type='hidden' value='✔️' />
            <TextField
              id='outlined-required-email'
              label='Username or Email'
              variant='outlined'
              autoFocus
              fullWidth
              inputRef={identifier}
            />

            <PasswordTextField handleLogin={onLogin} reference={password} />
            <input
              type='hidden'
              name='loginFlow'
              id='loginFlow'
              value='REMEMBER_ME_OPTIN'
            />

            <div className='login-btn-container'>
              <button
                className='login-btn'
                type='submit'
                aria-label='Sign in'
                disabled={loading || checkingCookiesLoading}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
