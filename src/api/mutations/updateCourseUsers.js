/*
 */
import { gql } from '@apollo/client';

export const UPDATE_COURSE_USERS = gql`
  mutation updateCourseUsers($id: ID!, $users: [ID]!) {
    updateCourse(input: { where: { id: $id }, data: { users: $users } }) {
      course {
        id
      }
    }
  }
`;

export const CREATE_COURSE_USER_PREF = gql`
  mutation createCourseUserPref($course: ID!, $user: ID!) {
    createCourseLecturerPreference(
      input: { data: { course: $course, user: $user } }
    ) {
      courseLecturerPreference {
        id
      }
    }
  }
`;
