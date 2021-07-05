import { useContext, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as RightArrowIcon } from 'assets/icons/right_arrow.svg';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PASSWORD } from 'api/mutations/updateUserInfo';
import { LOGIN } from 'api/mutations/login';
import { SettingsPageContext } from './SettingsPage';

export const SecuritySection = () => {
  const {
    authedUser: { email, id },
  } = useContext(SettingsPageContext);

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [changingPasswordError, setChangingPasswordError] = useState('');
  const [changingPasswordSuccessful, setChangingPasswordSuccessful] =
    useState('');
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);
  const [loginMutation, { loading: checkPasswordLoading }] = useMutation(LOGIN);
  const [updateUserPassword, { loading: updatePasswordLoading }] =
    useMutation(UPDATE_USER_PASSWORD);

  const tryToLogin = async () => {
    try {
      const {
        data: {
          login: { jwt },
        },
      } = await loginMutation({
        variables: {
          identifier: email,
          password: currentPasswordRef?.current?.value,
        },
      });

      return Boolean(jwt);
    } catch (err) {
      setChangingPasswordError('Incorrect Password.');
      console.error(err.message);
      return false;
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (
        newPasswordRef.current.value !== confirmNewPasswordRef.current.value
      ) {
        setChangingPasswordError('Passwords must match!');
        return;
      }
      const passwordRegExp = new RegExp(
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/
      );
      if (!passwordRegExp.test(newPasswordRef.current.value)) {
        setChangingPasswordError(
          'Password must contain at least two characters and numbers.'
        );
        return;
      }
      const isAuthenticated = await tryToLogin();

      if (!isAuthenticated) return;

      await updateUserPassword({
        variables: {
          id,
          password: newPasswordRef.current.value,
        },
      });
      setChangingPasswordError('');
      setChangingPasswordSuccessful('Your password has been changed.');
      //check for the current password by making a login mutation
    } catch (err) {
      setChangingPasswordError('An error occurred, please try again later.');
      console.error(err.message);
    }
  };
  return (
    <section className='settings-section security-section'>
      <header>
        <h3 className='third-color'>Security</h3>
      </header>
      <div className='change-password-grid'>
        <div className='change-password-container'>
          <div
            className='title-with-subtitle-pref'
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowChangePasswordForm(!showChangePasswordForm);
            }}
          >
            <span className='third-color font-weight500 one-rem-fon-size'>
              Change your Password
            </span>
            <span className='secondary-color subtitle-pref'>
              it’s a good idea to use a strong password that you’re not using
              elsewhere
            </span>
          </div>
          <RightArrowIcon />
        </div>

        <CSSTransition
          in={showChangePasswordForm}
          unmountOnExit
          timeout={500}
          classNames={'show-change-password-form'}
        >
          <form
            className='change-password-form'
            onSubmit={handleChangePassword}
          >
            <CSSTransition
              in={Boolean(changingPasswordError)}
              unmountOnExit
              timeout={300}
              classNames={'identifier-error'}
            >
              <span className='identifier-error'>{changingPasswordError}</span>
            </CSSTransition>

            <CSSTransition
              in={Boolean(changingPasswordSuccessful)}
              unmountOnExit
              timeout={300}
              classNames={'identifier-error'}
            >
              <span className='changed-password-success'>
                {changingPasswordSuccessful}
              </span>
            </CSSTransition>
            <input
              id='current-password'
              placeholder='Current Password'
              name='current-password'
              type='password'
              autoComplete='new-password'
              ref={currentPasswordRef}
              required
            />
            <input
              id='new-password'
              placeholder='New Password'
              name='new-password'
              type='password'
              autoComplete='new-password'
              required
              ref={newPasswordRef}
            />
            <input
              id='confirm-new-password'
              placeholder='Confirm Password'
              name='confirm-password'
              autoComplete='new-password'
              type='password'
              required
              ref={confirmNewPasswordRef}
            />
            <button
              type='submit'
              className='save-changes-btn'
              style={{ marginTop: '1rem' }}
              disabled={checkPasswordLoading || updatePasswordLoading}
            >
              <span>Change Password</span>
            </button>
          </form>
        </CSSTransition>
      </div>
    </section>
  );
};
