/*
 */
import { gql } from '@apollo/client';

export const ASSIGN_STUDENT_TO_LECTURE = gql`
  mutation assignStudentToLectureToLecture(
    $timestamp: DateTime!
    $student: ID!
    $lecture: ID!
  ) {
    createAttendance(
      input: {
        data: { timestamp: $timestamp, student: $student, lecture: $lecture }
      }
    ) {
      attendance {
        id
      }
    }
  }
`;

export const ASSIGN_STUDENT_TO_SECTION = gql`
  mutation assignStudentToSection(
    $timestamp: DateTime!
    $student: ID!
    $section: ID!
  ) {
    createAttendance(
      input: {
        data: { timestamp: $timestamp, student: $student, section: $section }
      }
    ) {
      attendance {
        id
      }
    }
  }
`;
