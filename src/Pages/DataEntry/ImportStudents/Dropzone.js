import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { readExcel } from 'utlis/helpers/readExcelFile';

const DropzoneContainer = ({
  setFile,
  setFileFormatError,
  fileFormatError,
  propsToCheck,
}) => {
  const handleChangeStatus = async ({ meta, file }, status) => {
    if (status === 'done') {
      const result = await readExcel(file);

      if (
        result[0].hasOwnProperty(
          propsToCheck === 'student-import'
            ? 'ID' && 'اسم الطالب' && 'الرقم القومي' && 'الايميل'
            : ''
        )
      ) {
        setFile(result);
      } else {
        setFileFormatError('error');
        return;
      }
    }
    if (status === 'removed') {
      setFile(null);
      setFileFormatError(null);
    }
  };

  return (
    <Dropzone
      addClassNames={{
        submitButtonContainer: 'submitButtonContainer',
        dropzone: `dropzone-wrapper ${fileFormatError && 'dropzone-error'}`,
        inputLabel: 'input-label',
      }}
      onChangeStatus={handleChangeStatus}
      accept='.xlsx, .csv,'
      maxFiles={1}
    />
  );
};

export default DropzoneContainer;
