import { gql } from '@apollo/client';

export const GET_FACULTY_DATA = gql`
  query GET_FACULTY_Data {
    faculties {
      id
      FacultyNameInArabic
      FacultyNameInEnglish
      departments {
        id
        DepartmentID
        DepartmentNameInArabic
        DepartmentNameInEnglish
        academic_years(sort: "YearNumber:asc") {
          AcademicYearInArabic
          AcademicYearInEnglish
          YearNumber
          id
          groups(sort: "GroupID:asc") {
            GroupID
            GroupNumber
            id
          }
        }
      }
    }
  }
`;
