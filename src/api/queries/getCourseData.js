import { gql } from '@apollo/client';

export const GET_COURSE_DATA = gql`
  query($id: ID!) {
    course(id: $id) {
      id
      CourseID
      CourseNameInArabic
      CourseNameInEnglish
      OverallScore
      academic_years {
        AcademicYearInArabic
        AcademicYearInEnglish
        YearNumber
        id
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
