import { gql } from '@apollo/client';

export const GET_USERNAMES_EMAILS = gql`
  query {
    users {
      username
      email
    }
  }
`;
