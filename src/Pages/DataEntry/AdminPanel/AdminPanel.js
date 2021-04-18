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
        <h3>Admin Panel 🧑🏻‍💼</h3>
        <p className='font-weight500'>
          Please note that this actions are only accessed by the admin and no
          one else is authorized to access these pages and modify the data{' '}
        </p>
      </header>
      <SelectCardsComponent />
    </main>
  );
};

export default DataEntryPage;
