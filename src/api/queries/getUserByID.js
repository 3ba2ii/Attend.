import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query MyQuery($id: ID!) {
    user(id: $id) {
      id
      LecturerNameInArabic
      LecturerNameInEnglish
      username
      confirmed
      blocked
      email
      username
      isMailNotificationsUsed
      isOverallSystemNotificationUsed
      role {
        name
        type
        id
      }
      avatar {
        url
      }
    }
  }
`;
