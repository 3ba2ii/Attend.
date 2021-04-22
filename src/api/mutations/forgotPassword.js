import { gql } from '@apollo/client';

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPasswordMutation($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;
