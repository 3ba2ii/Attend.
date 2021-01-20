import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { fakeAuth } from '../../routes';
import Carousel from '../common/Carousel';

import './login.css';
import carouselItems from '../../types/constants/carousel';
import { Form } from '../common/Form';

import logo from '../../assets/logo.png';
import Logo from '../common/Logo';

const Login = () => {
  console.log('a7a');
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { state } = useLocation();

  const onLogin = () => {
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true);
    });
  };
  if (redirectToReferrer) {
    return <Redirect to={state?.from || '/'} />;
  }

  return (
    <div className='login-grid-container'>
      <div className='carousel-col1'>
        <div className='login-form-container'>
          <Logo {...{ className: 'login-logo' }} />

          <form className='loginForm'>
            <header>
              <h2>Sign in</h2>
              <p className='sign-in-paragraph'>
                Login to access your courses and download your reports, if you
                have a trouble signing in please{' '}
                <span className='blue-span'>contact us.</span>
              </p>
            </header>
            <Form {...{ className: 'email', name: 'email', type: 'email' }} />
            <Form
              {...{ className: 'password', name: 'password', type: 'password' }}
            />

            <button className='btn-grad'>Sign in</button>
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
