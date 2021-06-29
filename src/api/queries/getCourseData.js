import { gql } from '@apollo/client';

export const GET_COURSE_DATA = gql`
  query ($id: ID!) {
    course(id: $id) {
      id
      CourseID
      CourseNameInEnglish
      academic_year {
        AcademicYearInEnglish
        department {
          DepartmentNameInEnglish
        }
      }

      users(sort: "LecturerNameInArabic:asc") {
        id
        LecturerNameInArabic
        LecturerNameInEnglish
        avatar {
          url
        }
        role {
          name
        }
      }
      CourseAvatar {
        url
      }
    }
  }
`;
