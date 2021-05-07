import { gql } from '@apollo/client';

export const GET_COURSE_STUDENTS_ATTENDANCE_RATES = gql`
  query MyQuery($id: ID!) {
    lectures(where: { course: $id }, sort: "LectureNumber:asc") {
      LectureNumber
      LectureName
      LectureDateTime
      attendances {
        student {
          id
        }
      }
    }
    sections(where: { course: $id }, sort: "SectionNumber:asc") {
      SectionNumber
    }
    course(id: $id) {
      academic_year {
        groups {
          students {
            id
          }
        }
      }
    }
  }
`;
