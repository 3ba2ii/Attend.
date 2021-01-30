import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

export function Error({ ignoreError }) {
  console.log(
    `🚀 ~ file: Error.js ~ line 5 ~ Error ~ ignoreError`,
    ignoreError
  );
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
