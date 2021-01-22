import React, { useState } from 'react';
import './form.css';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export const Form = (props) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  return (
    <div className={`${props.className}-form`}>
      <div className='visible'>
        {props.type === 'password' &&
          (!visiblePassword ? (
            <span
              className='cursor-pointer'
              onClick={() => setVisiblePassword(true)}
            >
              <VisibilityIcon
                className='visibility-icon'
                style={{ color: '#90a0b7', fontSize: '22px' }}
              />
            </span>
          ) : (
            <span
              className='cursor-pointer'
              onClick={(e) => setVisiblePassword(false)}
            >
              <VisibilityOffIcon
                className='visibility-icon'
                style={{ color: '#90a0b7', fontSize: '22px' }}
              />
            </span>
          ))}
      </div>
      <input
        type={
          props.type === 'text' ? 'text' : visiblePassword ? 'text' : 'password'
        }
        name={props.name}
        required={props.required || true}
        onChange={(e) => {
          props.onChange(e);
        }}
        autoComplete='off'
      />

      <label htmlFor={props.name} className={`label-name`}>
        <span className='content-name'>{props.name}</span>
      </label>
    </div>
  );
};
