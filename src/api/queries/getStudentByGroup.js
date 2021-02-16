import { gql } from '@apollo/client';

export const GET_STUDENT_BY_GROUP = gql`
  query($group: ID!) {
    students(where: { group: $group }) {
      id
      _id
    }
  }
`;
