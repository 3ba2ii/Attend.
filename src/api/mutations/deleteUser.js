import { gql } from '@apollo/client';

export const DELETE_USER = gql`
  mutation deleteUser($id: ID = "") {
    deleteUser(input: { where: { id: $id } }) {
      user {
        id
      }
    }
  }
`;
