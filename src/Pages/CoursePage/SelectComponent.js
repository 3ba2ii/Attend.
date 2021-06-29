import { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export const SelectComponent = ({
  options,
  handleChange,
  isMulti,
  __typename,
}) => {
  const animatedComponents = useMemo(() => makeAnimated(), []);

  return (
    <Select
      options={options}
      className='basic-multi-select'
      classNamePrefix='select'
      components={animatedComponents}
      isMulti={isMulti}
      onChange={handleChange}
      placeholder={`Select ${__typename}...`}
    />
  );
};
