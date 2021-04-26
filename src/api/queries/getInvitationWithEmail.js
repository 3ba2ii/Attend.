import { gql } from '@apollo/client';

export const GET_USER_INVITATION_WITH_EMAIL = gql`
  query EMAIL_INVITATION($email: String!) {
    userInvitations(where: { email: $email }) {
      id
      isUsed
    }
  }
`;
