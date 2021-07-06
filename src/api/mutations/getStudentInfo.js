/*
 */
import { gql } from '@apollo/client';

export const GET_STUDENT_INFO = gql`
  query getStudentInfo($id: ID!) {
    student(id: $id) {
      StudentNameInArabic
      StudentOfficialEmail
      NationalID
      id
      group {
        GroupNumber
        academic_year {
          AcademicYearInEnglish
          department {
            DepartmentNameInEnglish
          }
        }
      }
    }
  }
`;

export const GET_STUDENT_ATTENDANCES = gql`
  query getStudentAttendances($id: ID!) {
    student(id: $id) {
      group {
        academic_year {
          courses {
            id
            CourseNameInEnglish
            lectures {
              LectureNumber
            }
            sections {
              SectionNumber
            }
          }
        }
      }
      attendances {
        id
        section {
          SectionDateTime
          SectionNumber
          id
          course {
            CourseNameInEnglish
            id
          }
        }
        lecture {
          LectureNumber
          LectureDateTime
          id
          course {
            CourseNameInEnglish
            id
          }
        }
      }
    }
  }
`;
