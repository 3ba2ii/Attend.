import { gql } from '@apollo/client';

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation(
    $passwordConfirmation: String!
    $password: String!
    $code: String!
  ) {
    resetPassword(
      code: $code
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      user {
        username
      }
    }
  }
`;
