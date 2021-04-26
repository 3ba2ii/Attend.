import { gql } from '@apollo/client';

export const CREATE_INVITATION = gql`
  mutation CreateInvitation(
    $email: String!
    $role: ID!
    $user: ID!
    $department: ID!
    $latest_invitation_time: DateTime!
  ) {
    createUserInvitation(
      input: {
        data: {
          email: $email
          role: $role
          user: $user
          department: $department
          latest_invitation_time: $latest_invitation_time
        }
      }
    ) {
      userInvitation {
        id
      }
    }
  }
`;

export const UPDATE_INVITATION_DATE = gql`
  mutation UpdateUserInvitation(
    $latest_invitation_time: DateTime!
    $id: ID!
    $department: ID!
    $role: ID!
    $user: ID!
  ) {
    updateUserInvitation(
      input: {
        data: {
          latest_invitation_time: $latest_invitation_time
          department: $department
          role: $role
          user: $user
        }
        where: { id: $id }
      }
    ) {
      userInvitation {
        id
      }
    }
  }
`;
