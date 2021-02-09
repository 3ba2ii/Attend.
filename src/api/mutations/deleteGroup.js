import { gql } from '@apollo/client';

export const DELETE_GROUP = gql`
  mutation($id: ID!) {
    deleteGroup(input: { where: { id: $id } }) {
      group {
        id
        GroupID
        GroupNumber
      }
    }
  }
`;
