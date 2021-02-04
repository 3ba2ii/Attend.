import { gql } from '@apollo/client';

export const GET_FACULTY_DATA = gql`
  query GET_FACULTY_Data {
    faculties {
      FacultyNameInArabic
      FacultyNameInEnglish
      id
      departments {
        DepartmentID
        DepartmentNameInEnglish
        DepartmentNameInArabic
        id
        majors {
          id
          MajorID
          MajorNameInArabic
          MajorNameInEnglish
          academic_years {
            AcademicYearInEnglish
            id
            groups {
              GroupID
              GroupNumber
              id
            }
          }
        }
      }
    }
  }
`;
