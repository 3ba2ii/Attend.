import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query MyQuery($id: ID!) {
    user(id: $id) {
      blocked
      confirmed
      email
      id
      updatedAt
      username
      lecturer {
        LecturerNameInArabic
        LecturerNameInEnglish
        id
        isMailNotificationUsed
        isOverallSystemNotificationUsed
        notifications(limit: 40, sort: "createdAt:asc") {
          id
          isSeen
          published_at
          type
        }
        avatar {
          previewUrl
          url
        }
      }
      role {
        name
        type
        id
      }
    }
  }
`;
