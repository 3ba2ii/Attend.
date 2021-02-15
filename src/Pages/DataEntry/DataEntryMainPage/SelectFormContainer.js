import { MenuItem, TextField } from '@material-ui/core';
import React from 'react';

export function SelectFormContainer({
  selected,
  handleSelection,
  selections,
  id,
  label,
  helperText,
  valueText,
  error,
}) {
  return (
    <TextField
      id={`outlined-select-${id}`}
      select
      label={label}
      value={selected}
      onChange={handleSelection}
      helperText={helperText}
      variant='outlined'
      required
      disabled={!selections || selections?.length === 0}
      error={error}
    >
      {selections ? (
        selections.map((sel) => (
          <MenuItem key={sel.id} value={sel.id}>
            {sel[valueText]}
          </MenuItem>
        ))
      ) : (
        <MenuItem key={`not-found-${id}`} value={`not-found-${id}`}>
          Not Found
        </MenuItem>
      )}
    </TextField>
  );
}
