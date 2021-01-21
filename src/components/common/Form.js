import React from 'react';
import './form.css';

export const Form = (props) => {
  return (
    <div className={`${props.className}-form`}>
      <input
        type={props.type}
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
