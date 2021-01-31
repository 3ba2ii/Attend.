import { gql, useQuery } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query MyQuery {
    user(id: "6009a36afbff4a336d138b0f") {
      blocked
      confirmed
      createdAt
      email
      id
      provider
      role {
        id
        description
        name
        type
      }
      username
      updatedAt
    }
  }
`;
