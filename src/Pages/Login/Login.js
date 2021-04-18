import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { LOGIN } from 'api/mutations/login';
import { Error } from 'components/common/Error';
import Logo from 'components/common/Logo';
import PasswordTextField from 'components/common/PasswordTextField';
import SpinnerElement from 'components/Spinner/spinner';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { LoginAction } from 'redux/actions/authedAction';
import { FAILED_AUTHENTICATION } from 'types/constants/redux-constants';
import { checkCookies } from 'utlis/helpers/checkCookies';
import './login.css';

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
        identifier: identifier,
        password: password,
        LoginMutation: loginMutation,
      });
      if (action.type === FAILED_AUTHENTICATION) {
        setError(true);
        setLoading(false);
      } else {
        dispatch(action);
        setLoading(false);
        setRedirectToReferrer(true);
      }
    },
    [
      dispatch,
      setLoading,
      setRedirectToReferrer,
      identifier,
      password,
      setError,
      loginMutation,
    ]
  );
  const onChange = {
    email: (e) => {
      setIdentifier(e.target.value);
    },
    password: (e) => {
      setPassword(e.target.value);
    },
  };
  const ignoreError = useCallback(() => {
    setError(false);
  }, []);

  useEffect(() => {
    document.title = 'Attend. | Sign in';
    const token = Cookies.get('token');
    const userID = Cookies.get('authedUser');

    if (token && userID && !mounted) {
      checkCookies({
        dispatch,
        setLoading,
        setRedirectToReferrer,
        setMounted,
        setCheckingCookiesLoading,
        token,
        userID,
      });
    } else {
      setCheckingCookiesLoading(false);
      setMounted(true);
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
              Save time, store attendance and make reports
            </span>
          </header>
          {error && <Error ignoreError={ignoreError} />}
          <form onSubmit={onLogin} className='login-form'>
            <input name='utf8' type='hidden' value='✔️' />
            <TextField
              id='outlined-required-email'
              label='Username or Email'
              variant='outlined'
              onChange={onChange.email}
              autoFocus
              fullWidth
            />

            <PasswordTextField handleChangeInForm={onChange.password} />
            <input
              type='hidden'
              name='loginFlow'
              id='loginFlow'
              value='REMEMBER_ME_OPTIN'
            />

            <div className='login-btn-container'>
              <button
                className='login-btn'
                data-litms-control-urn='login-submit'
                type='submit'
                aria-label='Sign in'
                disabled={loading}
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
