import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { LOGIN } from '../../api/mutations/login';
import Carousel from '../../components/common/Carousel';
import { Error } from '../../components/common/Error';
import { Form } from '../../components/common/Form';
import Logo from '../../components/common/Logo';
import { LoginAction } from '../../redux-store/actions/authedAction';
import carouselItems from '../../types/constants/carousel';
import { FAILED_AUTHENTICATION } from '../../types/constants/redux-constants';
import { checkCookies } from '../../utlis/helpers/checkCookies';
import { LoadingSpinner } from './LoadingSpinner';
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

  const onLogin = async (e) => {
    e.preventDefault();
    /* const isValidEmail = validateEmail(identifier);
    const isValidPassword = validatePassword(password);
    if (!isValidEmail || !isValidPassword) {
      setError(true);
      return;
    } */
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
  };
  const onChange = {
    email: (e) => {
      setIdentifier(e.target.value);
    },
    password: (e) => {
      setPassword(e.target.value);
    },
  };
  const ignoreError = () => {
    setError(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
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
  }, [dispatch, mounted]);

  if (redirectToReferrer) {
    return <Redirect to={state?.from || '/dashboard'} />;
  }
  if (checkingCookiesLoading) {
    return LoadingSpinner();
  }
  return (
    <div className='login-grid-container'>
      <div className='carousel-col1'>
        <div className='login-form-container'>
          <Logo {...{ className: 'login-logo' }} />

          <form className='loginForm' onSubmit={onLogin}>
            <header>
              <h2>Sign in</h2>
              <p className='sign-in-paragraph'>
                Login to access your courses and download your reports, if you
                have a trouble signing in please{' '}
                <span className='blue-span'>contact us.</span>
              </p>
            </header>
            {error && <Error ignoreError={ignoreError} />}
            <Form
              onChange={onChange.email}
              {...{ className: 'email', name: 'Username', type: 'text' }}
            />
            <Form
              onChange={onChange.password}
              {...{ className: 'password', name: 'password', type: 'password' }}
            />

            <button
              className={`btn-grad sign-in-button ${loading && 'loading-btn'}`}
            >
              Sign in
            </button>
            <p className='student-sign-in'>
              a student?<span> Sign in as a student</span>
            </p>
          </form>
        </div>
      </div>
      {mounted && <Carousel items={carouselItems} />}
    </div>
  );
};

export default Login;
