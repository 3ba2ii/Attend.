/* eslint-disable no-use-before-define */
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { GET_DEPARTMENTS } from 'api/queries/getDepartments';
import { limitTagsStyles } from 'types/styles';
import Query from '../Query';

export default function LimitTags({ onSelectDepartment }) {
  const classes = limitTagsStyles();

  return (
    <div className={classes.root}>
      <Query query={GET_DEPARTMENTS}>
        {({ data: { departments } }) => {
          return (
            <Autocomplete
              onChange={onSelectDepartment}
              id='multiple-limit-tags'
              options={departments || []}
              getOptionLabel={(dep) => dep?.DepartmentNameInArabic}
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
          );
        }}
      </Query>
    </div>
  );
}
