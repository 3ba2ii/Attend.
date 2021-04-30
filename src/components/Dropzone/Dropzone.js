import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { readExcel } from 'utlis/helpers/readExcelFile';
import './dropzone.css';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '3rem',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#dddd',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

function DropZoneContainer({ setXLSXFile, setFileFormatError, propsToCheck }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (acceptedFiles) => {
    try {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: '.xlsx, .csv',
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  useEffect(() => {
    async function readExcelData() {
      if (files && files.length) {
        const result = await readExcel(files[0]);

        if (
          result[0].hasOwnProperty(
            propsToCheck === 'student-import'
              ? 'ID' && 'اسم الطالب' && 'الرقم القومي' && 'الايميل'
              : 'Email' && 'Department' && 'Role'
          )
        ) {
          setXLSXFile(result);
          setFileFormatError(false);
        }
      } else {
        setFileFormatError(true);
      }
    }
    readExcelData();
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);
  return (
    <section className='drag-n-drop-container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {files?.length ? (
          <div className='file-info'>{files[0].name}</div>
        ) : (
          <div className='drag-n-drop-text-header'>
            <p>Drag 'n' drop the excel file here, or click to select it</p>
            <span>Supported Files: .xlsx .csv</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default DropZoneContainer;
