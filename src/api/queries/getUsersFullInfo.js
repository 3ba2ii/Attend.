import { gql } from '@apollo/client';

export const GET_USERS_FULL_DATA = gql`
  query getUsersFullData {
    users(sort: "LecturerNameInArabic:asc") {
      id
      LecturerNameInArabic
      email
      username
      department {
        id
        DepartmentNameInEnglish
      }
      role {
        id
        name
      }
      avatar {
        id
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
export const GET_USERS_AND_COURSES_FULL_INFO = gql`
  query getUsersFullData($course: ID!) {
    users(sort: "LecturerNameInArabic:asc") {
      id
      LecturerNameInArabic
      email
      username
      department {
        DepartmentNameInEnglish
        DepartmentNameInArabic
      }
      role {
        id
        name
        type
      }
    }
    course(id: $course) {
      id
      users {
        id
        LecturerNameInArabic
        course_lecturer_preferences(where: { course: $course }) {
          id
        }
        role {
          id
          name
          type
        }
      }
    }
  }
`;
