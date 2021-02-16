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
  options,
  setSelectedForm,
}) {
  const classes = useStyles();
  const [option, setOption] = React.useState(options[0]);
  const handleChange = (event) => {
    setOption(event.target.value);
    setSelectedForm(event.target.value);
  };
  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <div>
        <TextField
          id='outlined-select-currency'
          select
          label={label}
          value={option}
          onChange={handleChange}
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
