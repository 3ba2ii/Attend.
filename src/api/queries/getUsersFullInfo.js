import { gql } from '@apollo/client';

export const GET_USERS_FULL_DATA = gql`
  query getUsersFullData {
    users(sort: "LecturerNameInArabic:asc") {
      id
      LecturerNameInArabic
      email
      username
      department {
        DepartmentNameInEnglish
      }
      role {
        name
      }
      avatar {
        url
      }
    }
  }
`;

export const GET_TOTAL_USERS_COUNT = gql`
  query getTotalUsersCount {
    usersConnection {
      aggregate {
        count
      }
    }
  }
`;
