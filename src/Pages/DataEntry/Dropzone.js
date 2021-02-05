import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { readExcel } from '../../utlis/helpers/readExcelFile';

const DropzoneContainer = ({ setStudentsFile }) => {
  const handleChangeStatus = async ({ meta, file }, status) => {
    console.log(status);
    if (status === 'done') {
      const result = await readExcel(file);

      setStudentsFile(result);
    }
    if (status === 'removed') {
      setStudentsFile(null);
    }
  };

  return (
    <Dropzone
      addClassNames={{
        submitButtonContainer: 'submitButtonContainer',
        dropzone: 'dropzone-wrapper',
        inputLabel: 'input-label',
      }}
      onChangeStatus={handleChangeStatus}
      accept='.xlsx, .csv,'
      maxFiles={1}
    />
  );
};

export default DropzoneContainer;
