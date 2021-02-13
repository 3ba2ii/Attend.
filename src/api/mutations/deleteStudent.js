import { gql } from '@apollo/client';

export const DELETE_STUDENT_BY_GROUP = gql`
  mutation($id: ID!) {
    deleteStudent(input: { where: { id: $id } }) {
      student {
        id
      }
    }
  }
`;
