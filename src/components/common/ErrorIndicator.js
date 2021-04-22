import closeIcon from 'assets/icons/closeIcon.svg';
import React from 'react';
import './errorIndicator.css';
export function Error({ ignoreError, message }) {
  return (
    <div className='login-error full-width-separated'>
      <span>{message}</span>
      <aside onClick={ignoreError}>
        <img src={closeIcon} alt={'close'} className='error-close-icon' />
      </aside>
    </div>
  );
}
