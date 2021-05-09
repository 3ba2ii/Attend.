import { gql } from '@apollo/client';

export const DELETE_COURSE_LECTURER_PREF = gql`
  mutation deleteCourseLecturerPreference($id: ID!) {
    deleteCourseLecturerPreference(input: { where: { id: $id } }) {
      courseLecturerPreference {
        id
      }
    }
  }
`;
