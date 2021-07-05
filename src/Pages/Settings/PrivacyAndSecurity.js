import { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import Switch from '@material-ui/core/Switch';
import {
  UPDATE_USER_ACCOUNT_PRIVACY_PREF,
  UPDATE_USER_ACTIVITIES_COURSES_PREF,
  UPDATE_USER_CONTACT_INFO_PREF,
} from 'api/mutations/updateUserInfo';
import { SecuritySection } from './SecuritySection';
import { SettingsPageContext } from './SettingsPage';

export const PrivacyAndSecurity = () => {
  const { authedUser } = useContext(SettingsPageContext);
  const {
    id,
    isPrivateAccount,
    isActivitiesCoursesPublic,
    isContactInfoPublic,
  } = authedUser;
  const [switchesState, setSwitchesState] = useState({
    'is-private-account': isPrivateAccount,
    'show-activities-and-courses': isActivitiesCoursesPublic,
    'is-contact-info-public': isContactInfoPublic,
  });
  const [updatePrivateAccountPref] = useMutation(
    UPDATE_USER_ACCOUNT_PRIVACY_PREF
  );
  const [updateCoursesActivitiesPref] = useMutation(
    UPDATE_USER_ACTIVITIES_COURSES_PREF
  );
  const [updateUserContactInfoPref] = useMutation(
    UPDATE_USER_CONTACT_INFO_PREF
  );

  const handleChangePrivateAccount = async (e) => {
    try {
      setSwitchesState({
        ...switchesState,
        'is-private-account': e.target.checked,
      });
      await updatePrivateAccountPref({
        variables: { id, isPrivateAccount: e.target.checked },
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleChangeActivitiesAndCoursesPref = async (e) => {
    try {
      setSwitchesState({
        ...switchesState,
        'show-activities-and-courses': e.target.checked,
      });
      await updateCoursesActivitiesPref({
        variables: { id, isActivitiesCoursesPublic: e.target.checked },
      });
    } catch (e) {
      console.error(e.message);
    }
  };
  const handleChangeContactInfoPref = async (e) => {
    try {
      setSwitchesState({
        ...switchesState,
        'is-contact-info-public': e.target.checked,
      });
      await updateUserContactInfoPref({
        variables: { id, isContactInfoPublic: e.target.checked },
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  const PrivacySectionCheckboxes = [
    {
      title: 'Private Account',
      subtitle: 'Only show your Avatar & Header with no other details',
      handleChange: handleChangePrivateAccount,
      switchStateName: 'is-private-account',
    },
    {
      title: 'Show your Activities & Courses',
      subtitle:
        'By enabling this, users see your activities and courses sections',
      handleChange: handleChangeActivitiesAndCoursesPref,
      switchStateName: 'show-activities-and-courses',
    },
    {
      title: 'Contact Information',
      subtitle:
        'By enabling this, users can see your contact information like email and phone number',
      handleChange: handleChangeContactInfoPref,
      switchStateName: 'is-contact-info-public',
    },
  ];

  return (
    <section className='settings-section'>
      <header>
        <h3 className='third-color'>Privacy</h3>
      </header>

      <section className='preferences-list-container'>
        {PrivacySectionCheckboxes.map(
          ({ title, subtitle, switchStateName, handleChange }, index) => (
            <div key={title + index} className='single-preference'>
              <div className='title-with-subtitle-pref'>
                <span className='third-color font-weight500 one-rem-fon-size'>
                  {title}
                </span>
                <span className='secondary-color subtitle-pref'>
                  {subtitle}
                </span>
              </div>
              <Switch
                checked={switchesState[switchStateName]}
                name='activities-and-courses'
                inputProps={{ 'aria-label': 'primary checkbox' }}
                color='primary'
                onChange={handleChange}
              />
            </div>
          )
        )}
      </section>
      <SecuritySection />
    </section>
  );
};
