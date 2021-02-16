import { gql } from '@apollo/client';

export const CREATE_LECTURER_ACCOUNT = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $role: ID!
    $nameInEnglish: String!
    $nameInArabic: String!
    $departments: [ID!]
  ) {
    createUser(
      input: {
        data: {
          username: $username
          email: $email
          password: $password
          role: $role
          LecturerNameInEnglish: $nameInEnglish
          LecturerNameInArabic: $nameInArabic
          departments: $departments
        }
      }
    ) {
      user {
        id
        email
        username
        role {
          name
        }
      }
    }
  }
`;
//"6018080da6926f2164cb93f6"
