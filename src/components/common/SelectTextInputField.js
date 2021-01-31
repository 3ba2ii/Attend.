import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '40ch',
    },
  },
}));

export default function MultilineTextFields({
  label,
  placeholder,
  handleChange,
  options,
  selectedOption,
}) {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <div>
        <TextField
          id='outlined-select-currency'
          select
          label={label}
          value={selectedOption}
          onChange={() => {
            handleChange(selectedOption);
          }}
          helperText={placeholder}
          variant='outlined'
        >
          {options.map((option, index) => (
            <MenuItem key={option + index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
}
