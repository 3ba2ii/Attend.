import { gql } from '@apollo/client';

export const GET_COURSES_INFO = gql`
  query {
    faculties(sort: "FacultyNameInArabic:asc") {
      FacultyNameInArabic
      FacultyNameInEnglish
      id
      departments(sort: "DepartmentNameInArabic:asc") {
        DepartmentNameInArabic
        DepartmentNameInEnglish
        id
        academic_years(sort: "AcademicYearInArabic:asc") {
          AcademicYearInArabic
          AcademicYearInEnglish
          YearNumber
          id
          terms(sort: "TermNumber:asc") {
            TermNumber
            id
            courses(sort: "CourseNameInArabic:asc") {
              CourseID
              CourseNameInArabic
              CourseNameInEnglish
              CourseAvatar {
                url
              }
              id
            }
          }
        }
      }
    }
  }
`;
