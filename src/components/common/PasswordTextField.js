import { OutlinedInput } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import VisibilityOff from 'assets/icons/visibilityOff.svg';
import Visibility from 'assets/icons/visibilityOn.svg';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { useStyles } from 'types/styles';

export default function PasswordTextField({ handleLogin, reference }) {
  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleChange = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      className={clsx(classes.margin, classes.textField)}
      variant='outlined'
    >
      <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
      <OutlinedInput
        inputProps={{
          autoComplete: 'off',
          form: {
            autoComplete: 'off',
          },
        }}
        id='standard-adornment-password'
        type={showPassword ? 'text' : 'password'}
        value={password}
        inputRef={reference}
        onChange={handleChange}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            handleLogin(ev);
          }
        }}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? (
                <img src={Visibility} alt='show' />
              ) : (
                <img src={VisibilityOff} alt='hide' />
              )}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={70}
      />
      <Link to={'/forgot-password'} style={{ marginTop: '.2rem' }}>
        <span className='forgot-password-btn'>Forgot password?</span>
      </Link>
    </FormControl>
  );
}
