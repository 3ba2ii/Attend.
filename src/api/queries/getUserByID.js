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
      isActivitiesCoursesPublic
      isPrivateAccount
      isContactInfoPublic
      PhoneNumber
      role {
        name
        type
        id
      }
      avatar {
        id
        url
      }
    }
  }
`;
