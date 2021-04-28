import { gql } from '@apollo/client';

export const GET_USERNAMES_EMAILS = gql`
  query {
    users {
      email
    }
    departments {
      id
      DepartmentNameInEnglish
      DepartmentNameInArabic
    }
    roles {
      id
      name
      type
    }

    userInvitations {
      id
      email
      isUsed
    }
  }
`;
