import { createContext, useEffect, useMemo, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { EditProfileSection } from './EditProfileSection';
import { EmailsAndNotifications } from './EmailsAndNotifications';
import { PrivacyAndSecurity } from './PrivacyAndSecurity';
import './settings.css';

export const SettingsPageContext = createContext();

const SettingsPage = () => {
  const { authedUser } = useSelector((state) => state.authReducer);
  const [displayedSettings, setDisplayedSettings] = useState('edit-profile');

  const isAdmin = useMemo(
    () => authedUser?.role?.name === 'Super Admin',
    [authedUser?.role?.name]
  );
  const __typename = useMemo(
    () =>
      authedUser?.role?.name !== 'Teacher Assistant' ? 'Lecture' : 'Section',
    [authedUser?.role?.name]
  );

  const handleDisplayedSettings = (path) => {
    setDisplayedSettings(path);
  };
  useEffect(() => {
    document.title = 'Attend. | Settings';
  }, []);
  return (
    <SettingsPageContext.Provider
      value={{
        displayedSettings,
        setDisplayedSettings,
        authedUser: authedUser,
        isAdmin,
        __typename,
      }}
    >
      <main id='settings-page-container'>
        <header>
          <h1 className='font-weight600 third-color'>Settings</h1>
        </header>
        <ul className='settings-elements'>
          <li
            className={
              displayedSettings === 'edit-profile' ? 'selected-tap' : ''
            }
            onClick={() => {
              handleDisplayedSettings('edit-profile');
            }}
          >
            Edit Profile
          </li>
          <li
            className={
              displayedSettings === 'emails-and-notifications'
                ? 'selected-tap'
                : ''
            }
            onClick={() => {
              handleDisplayedSettings('emails-and-notifications');
            }}
          >
            Emails and Notifications
          </li>
          <li
            className={
              displayedSettings === 'privacy-and-security' ? 'selected-tap' : ''
            }
            onClick={() => {
              handleDisplayedSettings('privacy-and-security');
            }}
          >
            Privacy & Security
          </li>
          {isAdmin && (
            <li
              className={
                displayedSettings === 'danger-area'
                  ? 'selected-tap danger-area-tap'
                  : ''
              }
              onClick={() => {
                handleDisplayedSettings('danger-area');
              }}
            >
              Danger Area
            </li>
          )}
        </ul>
        {displayedSettings && selectDisplayedSettings({ displayedSettings })}
      </main>
    </SettingsPageContext.Provider>
  );
};
const selectDisplayedSettings = ({ displayedSettings }) => {
  switch (displayedSettings) {
    case 'edit-profile':
      return <EditProfileSection />;
    case 'emails-and-notifications':
      return <EmailsAndNotifications />;
    case 'privacy-and-security':
      return <PrivacyAndSecurity />;
    case 'danger-area':
      return <section className='settings-section'>Danger Area</section>;
  }
};

export const CustomizeAvatarWithFormsLoader = (props) => {
  return (
    <ContentLoader
      width={'100%'}
      height={'100%'}
      viewBox='0 0 400 160'
      backgroundColor='#f3f3f3'
      foregroundColor='#ecebeb'
      {...props}
    >
      <rect x='80' y='73' rx='3' ry='3' width='254' height='6' />
      <rect x='78' y='88' rx='3' ry='3' width='254' height='6' />
      <rect x='150' y='103' rx='3' ry='3' width='118' height='6' />
      <circle cx='210' cy='27' r='22' />
      <circle cx='181' cy='151' r='6' />
      <circle cx='211' cy='151' r='6' />
      <circle cx='241' cy='151' r='6' />
      <rect x='37' y='54' rx='32' ry='32' width='15' height='15' />
      <rect x='37' y='46' rx='0' ry='0' width='4' height='18' />
      <rect x='54' y='54' rx='32' ry='32' width='15' height='15' />
      <rect x='54' y='46' rx='0' ry='0' width='4' height='19' />
      <rect x='336' y='118' rx='32' ry='32' width='15' height='15' />
      <rect x='357' y='118' rx='32' ry='32' width='15' height='15' />
      <rect x='347' y='123' rx='0' ry='0' width='4' height='18' />
      <rect x='368' y='123' rx='0' ry='0' width='4' height='18' />
    </ContentLoader>
  );
};

export default SettingsPage;
