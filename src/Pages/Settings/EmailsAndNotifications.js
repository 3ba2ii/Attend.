import { useMutation } from '@apollo/client';
import Switch from '@material-ui/core/Switch';
import {
  UPDATE_USER_MAILING_PREF,
  UPDATE_USER_NOTIFICATIONS_PREF,
} from 'api/mutations/updateUserInfo';
import { useContext, useState } from 'react';
import { SettingsPageContext } from './SettingsPage';

export const EmailsAndNotifications = () => {
  const { authedUser, __typename } = useContext(SettingsPageContext);
  const { id, isMailNotificationsUsed, isOverallSystemNotificationUsed } =
    authedUser;
  const [switchesState, setSwitchesState] = useState({
    'create-meeting-email': isMailNotificationsUsed,
    'attendance-alerts': isOverallSystemNotificationUsed,
  });
  const [updateUserMailingPref] = useMutation(UPDATE_USER_MAILING_PREF);
  const [updateUserNotificationsPref] = useMutation(
    UPDATE_USER_NOTIFICATIONS_PREF
  );

  const toggleStudentsAlertNotifications = async (e) => {
    setSwitchesState({
      ...switchesState,
      'attendance-alerts': e.target.checked,
    });
    await updateUserNotificationsPref({
      variables: { id, isOverallSystemNotificationUsed: e.target.checked },
    });
  };
  const toggleCreatingMeetingEmails = async (e) => {
    setSwitchesState({
      ...switchesState,
      'create-meeting-email': e.target.checked,
    });
    await updateUserMailingPref({
      variables: { id, isMailNotificationsUsed: e.target.checked },
    });
  };
  return (
    <section className='settings-section'>
      <header>
        <h3 className='third-color'>Emails and Notifications</h3>
      </header>
      <section className='preferences-list-container'>
        <div className='single-preference'>
          <div className='title-with-subtitle-pref'>
            <span className='third-color font-weight500 one-rem-fon-size'>
              Creating {__typename}s Emails
            </span>

            <span className='secondary-color subtitle-pref'>
              You can turn on or off emails received on creating new lectures
            </span>
          </div>
          <Switch
            checked={switchesState['create-meeting-email']}
            name='meeting-email'
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color='primary'
            onChange={toggleCreatingMeetingEmails}
          />
        </div>

        <div className='single-preference'>
          <div className='title-with-subtitle-pref'>
            <span className='third-color font-weight500 one-rem-fon-size'>
              Students’ Attendance Alerts Notifications
            </span>

            <span className='secondary-color subtitle-pref'>
              You can turn on or off students’ attendance alert notifications
              for all the the courses
            </span>
          </div>
          <Switch
            checked={switchesState['attendance-alerts']}
            name='meeting-email'
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color='primary'
            onChange={toggleStudentsAlertNotifications}
          />
        </div>
      </section>
    </section>
  );
};
