import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { Redirect, useLocation } from 'react-router-dom';

import './login.css';

import Carousel from '../common/Carousel';
import { Form } from '../common/Form';
import Logo from '../common/Logo';

import carouselItems from '../../types/constants/carousel';
import {
  validateEmail,
  validatePassword,
} from '../../utlis/validation/validation';
import { FAILED_AUTHENTICATION } from '../../types/constants/redux-constants';
import { LoginAction } from '../../redux-store/actions/authedAction';

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { state } = useLocation();

  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const isValidEmail = validateEmail(emailOrUsername);

    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      setError(true);
      return;
    }
    setLoading(true);
    const action = await LoginAction({
      identifier: emailOrUsername,
      password: password,
    });

    if (action.type === FAILED_AUTHENTICATION) {
      setError(true);
    } else {
      dispatch(action);
      setRedirectToReferrer(true);
    }
    setLoading(false);
  };
  const onChange = {
    email: (e) => {
      setEmailOrUsername(e.target.value);
    },
    password: (e) => {
      setPassword(e.target.value);
    },
  };
  if (redirectToReferrer) {
    return <Redirect to={state?.from || '/'} />;
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
            {error && (
              <div className='login-error full-width-separated'>
                <span>Incorrect username or password.</span>
                <CloseIcon
                  className='cursor-pointer error-color-icon'
                  fontSize={'small'}
                  onClick={() => setError(false)}
                />
              </div>
            )}
            <Form
              onChange={onChange.email}
              {...{ className: 'email', name: 'Username', type: 'text' }}
            />
            <Form
              onChange={onChange.password}
              {...{ className: 'password', name: 'password', type: 'password' }}
            />

            <button className={`btn-grad ${loading && 'loading-btn'}`}>
              Sign in
            </button>
            <p className='student-sign-in'>
              a student?<span> Sign in as a student</span>
            </p>
          </form>
        </div>
      </div>
      <Carousel items={carouselItems} />
    </div>
  );
};

export default Login;
