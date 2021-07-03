import { gql } from '@apollo/client';

export const GET_USER_FULLY_DETAILED_QUERY = gql`
  query userFullyDetailedQuery($username: String!) {
    users(where: { username: $username }) {
      LecturerNameInEnglish
      LecturerNameInArabic
      confirmed
      email
      id
      username
      department {
        id
        DepartmentNameInEnglish
        faculty {
          FacultyNameInEnglish
        }
      }
      role {
        name
      }
      avatar {
        url
      }
      coverImage {
        url
      }

      lectures(sort: "LectureDateTime:desc") {
        id
        LectureDateTime
        LectureName
        LectureNumber
        course {
          id
          CourseNameInEnglish
          CourseAvatar {
            url
          }
        }
        groups {
          GroupNumber
        }
      }
      sections(sort: "SectionDateTime:desc") {
        id
        SectionDateTime
        SectionNumber
        SectionName
        groups {
          GroupNumber
        }
        course {
          id
          CourseNameInEnglish
          CourseAvatar {
            url
          }
        }
      }
    }
  }
`;
