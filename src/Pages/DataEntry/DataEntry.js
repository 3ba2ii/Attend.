import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import './data_entry.css';
import SelectCardsComponent from './SelectCards';

const DataEntryPage = () => {
  const { user } = useSelector((state) => state?.authReducer?.authedUser);
  const [selectedPath, setSelectedPath] = useState('');
  let { url } = useRouteMatch();
  const { state } = useLocation();

  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <main id='data-entry-page'>
      <header className='data-entry-header'>
        <div>
          <span>Please select the data entry model</span>
          <p>
            Please note that this actions are only accessed by the admin and no
            one else is authorized to access these pages and modify the data{' '}
          </p>
        </div>
      </header>
      <SelectCardsComponent setSelectedPath={setSelectedPath} />
      <button className='btn-container'>
        <Link
          to={`${url}/${selectedPath}`}
          className={`route-to-path-btn ${
            selectedPath === null && 'disabled-btn'
          }`}
        >
          <span>Select</span>
          <NavigateNextIcon />
        </Link>
      </button>
    </main>
  );
};

export default DataEntryPage;
