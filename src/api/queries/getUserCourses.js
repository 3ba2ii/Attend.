/* query MyQuery($id: ID = "") {
  user(id: $id) {
    LecturerNameInArabic
    LecturerNameInEnglish
    courses(sort: "CourseNameInEnglish:asc") {
      id
      CourseNameInEnglish
      CourseNameInArabic
      CourseID
      CourseAvatar {
        url
      }
    }
  }
}
 */
import { gql } from '@apollo/client';

export const GET_USER_COURSES = gql`
  query getUserCourses($id: ID!) {
    user(id: $id) {
      courses(sort: "CourseNameInEnglish:asc") {
        id
        CourseNameInEnglish
        CourseNameInArabic
        CourseID
        CourseAvatar {
          url
        }
      }
    }
  }
`;
