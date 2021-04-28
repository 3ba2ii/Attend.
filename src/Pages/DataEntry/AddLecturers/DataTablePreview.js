import React from 'react';
import { checkStatus } from '../../../utlis/helpers/invtiationOperations/statusValidation';

export const DataTablePreview = ({
  headers,
  data,
  departments,
  currentUsersEmail,
  setFileFormatError,
}) => {
  if (!data) return null;

  const departmentNames = departments.map((d) =>
    d.DepartmentNameInEnglish.toLowerCase().trim()
  );
  const handleFileFormatError = () => {
    setFileFormatError(true);
  };
  return (
    <table className='styled-table'>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, index) => {
          const { Role, Department, Email } = d;

          const status = checkStatus({
            email: Email,
            department: Department,
            role: Role,
            users: currentUsersEmail,
            departments: departmentNames,
          });

          if (status !== 'Valid') {
            handleFileFormatError();
          }
          return (
            <tr key={Email + index}>
              <td>{Email}</td>
              <td>{Department}</td>
              <td>{Role}</td>
              <td>
                <span
                  className={`validation-badge ${
                    status === 'Valid' ? 'valid-badge' : 'not-valid-badge'
                  }`}
                >
                  {status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
