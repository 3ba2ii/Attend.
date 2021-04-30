import { gql } from '@apollo/client';

export const CREATE_ACCOUNT = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $role: ID!
    $department: ID!
    $nameInEnglish: String!
    $nameInArabic: String!
    $confirmed: Boolean!
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
          department: $department
          confirmed: $confirmed
        }
      }
    ) {
      user {
        id
        email
        LecturerNameInEnglish
        LecturerNameInArabic
        username
        department {
          DepartmentNameInEnglish
        }
        role {
          name
        }
      }
    }
  }
`;

export const UPDATE_USER_INVITATION_USED = gql`
  mutation UpdateUsedUserInvitation($id: ID!, $isUsed: Boolean!) {
    updateUserInvitation(
      input: { data: { isUsed: $isUsed }, where: { id: $id } }
    ) {
      userInvitation {
        id
      }
    }
  }
`;
