/* eslint-disable no-use-before-define */
import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { GET_DEPARTMENTS } from '../../api/queries/getDepartments';
import { limitTagsStyles } from '../../types/styles';

export default function LimitTags({ onSelectDepartments }) {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);
  const departments = data?.departments;
  const classes = limitTagsStyles();

  if (loading) {
    return (
      <div className={classes.center}>
        <CircularProgress size={'24px'} />;
      </div>
    );
  }
  if (error) return `Error! ${error.message}`;

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        limitTags={2}
        onChange={onSelectDepartments}
        id='multiple-limit-tags'
        options={departments}
        getOptionLabel={(dep) => dep.DepartmentNameInArabic}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            variant='outlined'
            label='Departments'
            placeholder='Departments'
          />
        )}
      />
    </div>
  );
}
