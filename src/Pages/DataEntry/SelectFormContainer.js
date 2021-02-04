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
      disabled={selections.length === 0}
      error={error}
    >
      {selections.map((sel) => (
        <MenuItem key={sel.id} value={sel.id}>
          {sel[valueText]}
        </MenuItem>
      ))}
    </TextField>
  );
}
