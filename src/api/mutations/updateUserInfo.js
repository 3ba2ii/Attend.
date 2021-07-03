/*
 */
import { gql } from '@apollo/client';

export const UPDATE_USER_INFO = gql`
  mutation UPDATE_USER_INFO(
    $id: ID!
    $LecturerNameInArabic: String!
    $LecturerNameInEnglish: String!
    $PhoneNumber: String!
    $avatar: ID!
    $email: String!
    $username: String!
  ) {
    updateUser(
      input: {
        where: { id: $id }
        data: {
          LecturerNameInArabic: $LecturerNameInArabic
          LecturerNameInEnglish: $LecturerNameInEnglish
          PhoneNumber: $PhoneNumber
          avatar: $avatar
          email: $email
          username: $username
        }
      }
    ) {
      user {
        id
      }
    }
  }
`;
