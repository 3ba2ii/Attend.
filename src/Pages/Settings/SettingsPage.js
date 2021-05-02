import { TextField } from '@material-ui/core';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './settings.css';
const SettingsPage = () => {
  const {
    authedUser: { LecturerNameInEnglish, avatar, role, username, email },
  } = useSelector((state) => state.authReducer);

  useEffect(() => {
    document.title = 'Attend. | Settings';
  }, []);
  return (
    <main id='settings-page-container'>
      <header>
        <h4 className='font-weight600'>Settings & Preferences</h4>
      </header>
      <main className='settings-page-content'>
        <section className='left-column-section'>
          <section className='account-information-section'>
            <h6>Account Information</h6>
            <div className='image-with-info-container'>
              <AvatarOrInitials
                url={avatar?.url}
                name={LecturerNameInEnglish}
                className='settings-page-avatar'
              />
              <aside>
                <span className='font-weight600'>{LecturerNameInEnglish}</span>
                <span>{role?.name || ''}</span>
              </aside>
            </div>
          </section>
          <section className='security-and-login-section'>
            <h6>Security and Login</h6>
            <section className='information-user-form-section'>
              <div className='input-field-container'>
                <label htmlFor='username'>Username</label>
                <div className='input-field'>
                  <input
                    type='text'
                    id='username'
                    name='username'
                    disabled
                    value={'@' + username}
                  />
                  <span className='icons8-edit' />
                </div>
              </div>
              <div className='input-field-container'>
                <label htmlFor='username'>Email Address</label>
                <div className='input-field'>
                  <input
                    type='text'
                    id='email'
                    name='email'
                    disabled
                    value={email}
                  />
                </div>
              </div>
            </section>
            <div className='change-password-form'>
              <header>
                <span className='font-weight600'> Change Password</span>
                <p>
                  It’s a good idea to use a strong password that you’re not
                  using elsewhere
                </p>
              </header>
              <span className='icons8-chevron-right' />
            </div>
          </section>
          <section className='report-a-problem'>
            <span>
              Got a problem?{' '}
              <a href='mailto:attend.qrsys@gmail.com'>Report it.</a>
            </span>
          </section>
        </section>

        <section className='preferences-section'>
          <h6>Preferences & Notifications</h6>

          <div className='checkbox-description-container'>
            <div className='checkbox'></div>
            <span className='checkbox-description'>
              Nulla consequat veniam aute cillum labore Lorem ipsum deserunt
              eiusmod ullamco.
            </span>
          </div>
        </section>
      </main>
    </main>
  );
};

export default SettingsPage;
