import React from 'react';
import { checkStatus } from 'utlis/helpers/invtiationOperations/statusValidation';

export const DataTablePreview = ({
  headers,
  data,
  departments,
  currentUsersEmail,
  setFileFormatError,
}) => {
  const departmentNames = departments.map((d) =>
    d.DepartmentNameInEnglish.toLowerCase().trim()
  );
  const handleFileFormatError = () => {
    setFileFormatError(true);
  };
  const checkValidStatus = ({
    email,
    department,
    role,
    users,
    departments,
  }) => {
    const status = checkStatus({
      email,
      department,
      role,
      users,
      departments,
    });
    if (status !== 'Valid') {
      handleFileFormatError(true);
    }
    return status;
  };

  if (!data) return null;

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

          const status = checkValidStatus({
            email: Email,
            department: Department,
            role: Role,
            users: currentUsersEmail,
            departments: departmentNames,
          });

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
