import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './data_entry.css';
import SelectCardsComponent from './SelectCards';

const DataEntryPage = () => {
  const { user } = useSelector((state) => state?.authReducer?.authedUser);
  const [selectedPath, setSelectedPath] = useState('');
  console.log(
    `🚀 ~ file: DataEntry.js ~ line 11 ~ DataEntryPage ~ selectedPath`,
    selectedPath
  );

  const { state } = useLocation();

  const optionsData = [
    {
      id: '327yiu37248',
      label: 'Major',
      placeholder: 'Please Select a Major',
      setSelectedForm: 'setMajor',
      options: ['test', 'nope', 'ds', 'test'],
    },
  ];
  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }

  return (
    <main id='data-entry-page'>
      <header className='data-entry-header'>
        {/* <h6>Admin Panel</h6> */}
        <div>
          <span>Please select the data the you wish to modify</span>
          <p>
            Please note that this actions are only accessed by the admin and no
            one else is authorized to access these pages and modify the data{' '}
          </p>
        </div>
      </header>
      <SelectCardsComponent setSelectedPath={setSelectedPath} />
      <div className='btn-container'>
        <Link to={selectedPath} className='route-to-path-btn'>
          Next
        </Link>
      </div>
    </main>
  );
};

export default DataEntryPage;
