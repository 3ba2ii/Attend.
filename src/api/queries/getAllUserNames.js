import { gql } from '@apollo/client';

export const GET_ALL_USERNAMES = gql`
  query get_all_usernames {
    users {
      email
      username
    }
  }
`;
