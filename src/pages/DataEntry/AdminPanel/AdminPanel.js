import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import './admin-panel.css';
import SelectCardsComponent from './SelectCards';

const DataEntryPage = () => {
  const user = useSelector((state) => state?.authReducer?.authedUser);
  const { state } = useLocation();

  useEffect(() => {
    document.title = 'Attend. | Admin Panel';
  }, []);
  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <main id='data-entry-page'>
      <header className='data-entry-header'>
        <h4 className='font-weight600'>Administration Panel 👨🏼‍💼</h4>
        <p className='font-weight400'>
          Please note that these actions are only accessed by the admin.
        </p>
      </header>
      <SelectCardsComponent />
    </main>
  );
};

export default DataEntryPage;
