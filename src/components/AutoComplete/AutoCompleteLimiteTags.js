/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useQuery } from '@apollo/client';
import { GET_DEPARTMENTS } from '../../api/queries/getDepartments';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  center: {
    width: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

export default function LimitTags({ onSelectDepartments }) {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);
  const departments = data?.departments;
  const classes = useStyles();

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
