import { gql } from '@apollo/client';

export const GET_COURSE_DATA = gql`
  query($id: ID!) {
    course(id: $id) {
      id
      CourseID
      CourseNameInArabic
      CourseNameInEnglish
      OverallScore
      academic_year {
        AcademicYearInArabic
        AcademicYearInEnglish
        YearNumber
        id
        department {
          DepartmentNameInEnglish
        }
      }
      terms {
        TermNumber
      }
      users(sort: "LecturerNameInArabic:asc") {
        LecturerNameInArabic
        LecturerNameInEnglish
        id
        role {
          type
          name
        }
      }
      CourseAvatar {
        url
      }
    }
  }
`;
