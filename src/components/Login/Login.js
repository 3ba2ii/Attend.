import statics from '../../assets/profit.png';
import time from '../../assets/time2.png';
import kingdom from '../../assets/kingdom.png';
import mail from '../../assets/Mail.png';

import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { fakeAuth } from '../../routes';
import Carousel from '../common/Carousel';

import './login.css';

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

  const carouselItems = [
    {
      name: 'Easy Reports',
      description:
        'Select and download your attendance reports with a lot of options and types.',
      image: statics,
    },
    {
      name: 'Automated Mails',
      description:
        'Alerts and notifications are sent to you via your email and appears on your account as well.',
      image: mail,
    },
    {
      name: 'Your Time Matters',
      description:
        'Save your precious time and get your attendance reports and statics right away!',
      image: time,
    },
    {
      name: 'Reward your Top Students',
      description:
        'Get to know how are your top students and send congratulations emails to them.',
      image: kingdom,
    },
  ];
  return (
    <div className='login-grid-container'>
      <div className='login-form-container carousel-col1'>
        <div className='logo side-by-side'>
          <img src={''} />
          <img src={''} />
        </div>
        <h2>Sign in</h2>
        <p>
          Login to access your courses and download your reports if you have a
          trouble signning in please{' '}
          <span className='blue-span'>contact us.</span>
        </p>
        <p>Username</p>
        <input></input>
        <p>Password</p>
        <input></input>
        <button className='btn-grad'>Sign in</button>
      </div>
      <Carousel items={carouselItems} />
    </div>
  );
};

export default Login;
