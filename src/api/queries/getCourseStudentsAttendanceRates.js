import { gql } from '@apollo/client';

export const GET_COURSE_STUDENTS_ATTENDANCE_RATES = gql`
  query COURSE_STUDENT_INFO($id: ID!) {
    lectures(where: { course: $id }, sort: "LectureDateTime:desc") {
      id
      LectureNumber
      LectureName
      LectureDateTime
      users_permissions_user {
        LecturerNameInEnglish
        avatar {
          url
        }
        role {
          name
        }
      }
      groups {
        GroupNumber
      }
      attendances {
        student {
          StudentNameInArabic
          id
        }
      }
    }
    sections(where: { course: $id }, sort: "SectionDateTime:desc") {
      id
      SectionNumber
      SectionName
      SectionDateTime
      users_permissions_user {
        LecturerNameInEnglish
        avatar {
          url
        }
      }
      groups {
        GroupNumber
      }
      attendances {
        student {
          StudentNameInArabic
          id
        }
      }
    }
    course(id: $id) {
      academic_year {
        groups {
          students(sort: "StudentNameInArabic") {
            StudentNameInArabic
            StudentOfficialEmail
            id
          }
        }
      }
    }
  }
`;
