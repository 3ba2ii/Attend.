import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

export function Error({ ignoreError }) {
  return (
    <div className='login-error full-width-separated'>
      <span>Incorrect username or password.</span>
      <CloseIcon
        className='cursor-pointer error-color-icon'
        fontSize={'small'}
        onClick={ignoreError}
      />
    </div>
  );
}
