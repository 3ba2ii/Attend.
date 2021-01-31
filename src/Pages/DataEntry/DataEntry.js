import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import MultilineTextFields from '../../components/common/SelectTextInputField';
import './data_entry.css';

const DataEntryPage = () => {
  const { user } = useSelector((state) => state?.authReducer?.authedUser);
  const [major, setMajor] = useState('ds');
  console.log(
    `🚀 ~ file: DataEntry.js ~ line 10 ~ DataEntryPage ~ major`,
    major
  );
  const { state } = useLocation();

  const optionsData = [
    {
      id: '327yiu37248',
      label: 'Major',
      placeholder: 'Please Select a Major',
      handleChange: setMajor,
      options: ['test', 'nope', 'ds', 'test'],
      selectedOption: major,
    },
  ];
  if (user?.role?.name !== 'Super Admin') {
    /* TODO: Add an unauthenticated behavior screen*/

    return <Redirect to={state?.from || '/dashboard'} />;
  }
  console.log(`🚀 ~ file: DataEntry.js ~ line 7 ~ DataEntryPage ~ user`, user);

  return (
    <main id='data-entry-page'>
      {optionsData.map((option, index) => {
        console.log(
          `🚀 ~ file: DataEntry.js ~ line 30 ~ {optionsData.map ~ option`,
          option
        );

        return <MultilineTextFields key={option.id} {...option} />;
      })}
    </main>
  );
};

export default DataEntryPage;
