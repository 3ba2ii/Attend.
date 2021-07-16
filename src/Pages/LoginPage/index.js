import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { LOGIN } from 'api/mutations/login';
import { GET_STUDENT_BY_NATIONAL_ID } from 'api/queries/getStudentWithNationalID';
import { Error } from 'components/common/ErrorIndicator';
import Logo from 'components/common/Logo';
import PasswordTextField from 'components/common/PasswordTextField';
import SpinnerElement from 'components/Spinner/spinner';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { LoginAction } from 'redux/actions/authedAction';
import { FAILED_AUTHENTICATION } from 'types/constants/redux-constants';
import client from 'utlis/apollo/apolloClient';
import { checkCookies } from 'utlis/helpers/checkCookies';
import './login.css';

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const identifier = useRef(null);
  const password = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { state } = useLocation();
  const [signInAsStudent, setSignInAsStudent] = useState(false);
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

  const onOpenStudentLogin = () => {
    setError(false);
    setSignInAsStudent(!signInAsStudent);
  };
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
    return <Redirect to={state?.from || '/courses'} />;
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

          <CSSTransition
            in={error}
            unmountOnExit
            timeout={500}
            classNames={'identifier-error'}
          >
            <Error
              ignoreError={ignoreError}
              message={
                signInAsStudent
                  ? 'Incorrect national id'
                  : 'Incorrect username or password.'
              }
            />
          </CSSTransition>

          <form className='login-form'>
            {signInAsStudent ? (
              <SignInAsStudentForm setError={setError} />
            ) : (
              <>
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
                    onClick={onLogin}
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <small onClick={onOpenStudentLogin} className='sign-in-as-button'>
          {signInAsStudent ? 'Sign in as a user' : 'Sign in as a student'}
        </small>
      </section>
    </main>
  );
};

const SignInAsStudentForm = ({ setError }) => {
  const nationalIDRef = useRef(null);
  const [studentID, setStudentID] = useState(null);
  const [redirectToStudentPage, setRedirectToStudentPage] = useState(false);

  const onSignInAsStudent = async (e) => {
    e.preventDefault();

    if (!nationalIDRef?.current?.value) return;

    try {
      //search for the student
      const {
        data: { students },
      } = await client.query({
        query: GET_STUDENT_BY_NATIONAL_ID,
        variables: {
          NationalID: nationalIDRef?.current?.value,
        },
      });

      if (!students?.length) {
        //set error
        setError(true);
        return;
      }
      setStudentID(students?.[0]?.id || null);
    } catch (e) {
      console.error(e.message);
      setError(true);

      return null;
    }
  };
  useEffect(() => {
    if (studentID) {
      console.log('now redirect to', studentID);
      setRedirectToStudentPage(true);
    }
  }, [studentID]);

  if (redirectToStudentPage) {
    return <Redirect to={`/public/student/${studentID}`} />;
  }

  return (
    <>
      <input name='utf8' type='hidden' value='✔️' />
      <TextField
        id='outlined-required-email'
        label='National ID'
        variant='outlined'
        autoFocus
        fullWidth
        inputRef={nationalIDRef}
      />

      <div className='login-btn-container'>
        <button
          className='login-btn'
          type='submit'
          aria-label='Sign in'
          onClick={onSignInAsStudent}
        >
          Sign in
        </button>
      </div>
    </>
  );
};
export default Login;
