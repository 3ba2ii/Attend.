import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query getUserNotifications($id: ID!) {
    user(id: $id) {
      courses {
        notifications {
          id
          createdAt
          course {
            CourseNameInEnglish
          }
          student {
            StudentNameInArabic
            id
          }
          isSeen
          type
        }
      }
    }
  }
`;
