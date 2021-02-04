import React from 'react';
import loadingImage from '../../assets/attendSpinner.gif';

export function LoadingSpinner() {
  return (
    <div className='loading-spinner'>
      <img src={loadingImage} alt='spinner' />
    </div>
  );
}
