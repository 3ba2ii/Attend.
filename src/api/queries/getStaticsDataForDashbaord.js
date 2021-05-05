import { gql } from '@apollo/client';

export const GET_COUNTS_FOR_DASHBOARD = gql`
  query getStaticsData {
    studentsCount
    lecturesConnection {
      aggregate {
        count
      }
    }
    sectionsConnection {
      aggregate {
        count
      }
    }
    rolesConnection {
      values {
        name
        users {
          id
        }
      }
    }
  }
`;

export const GET_TOP_USERS_PER_LECTURES = gql`
  query get_top_users {
    users {
      lectures {
        id
      }
      LecturerNameInEnglish
      username
      avatar {
        url
      }
    }
  }
`;
