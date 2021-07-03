/*
 */
import { gql } from '@apollo/client';

export const GET_DEPARTMENT_USERS = gql`
  query GET_DEPARTMENT_USERS($id: ID!) {
    department(id: $id) {
      users {
        username
        LecturerNameInEnglish
        role {
          name
        }
        avatar {
          url
        }
      }
    }
  }
`;
