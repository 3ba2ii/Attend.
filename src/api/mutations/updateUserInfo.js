/*
 */
import { gql } from '@apollo/client';

export const UPDATE_USER_INFO = gql`
  mutation UPDATE_USER_INFO(
    $id: ID!
    $LecturerNameInArabic: String!
    $LecturerNameInEnglish: String!
    $PhoneNumber: String!
    $avatar: ID!
    $email: String!
    $username: String!
  ) {
    updateUser(
      input: {
        where: { id: $id }
        data: {
          LecturerNameInArabic: $LecturerNameInArabic
          LecturerNameInEnglish: $LecturerNameInEnglish
          PhoneNumber: $PhoneNumber
          avatar: $avatar
          email: $email
          username: $username
        }
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_NOTIFICATIONS_PREF = gql`
  mutation updateUserNotificationPref(
    $id: ID!
    $isOverallSystemNotificationUsed: Boolean!
  ) {
    updateUser(
      input: {
        where: { id: $id }
        data: {
          isOverallSystemNotificationUsed: $isOverallSystemNotificationUsed
        }
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_MAILING_PREF = gql`
  mutation updateUserMailingPref($id: ID!, $isMailNotificationsUsed: Boolean!) {
    updateUser(
      input: {
        where: { id: $id }
        data: { isMailNotificationsUsed: $isMailNotificationsUsed }
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_ACCOUNT_PRIVACY_PREF = gql`
  mutation updateUserAccountPrivacyPref($id: ID!, $isPrivateAccount: Boolean!) {
    updateUser(
      input: {
        where: { id: $id }
        data: { isPrivateAccount: $isPrivateAccount }
      }
    ) {
      user {
        id
      }
    }
  }
`;
export const UPDATE_USER_ACTIVITIES_COURSES_PREF = gql`
  mutation updateUserCoursesAndActivitiesPref(
    $id: ID!
    $isActivitiesCoursesPublic: Boolean!
  ) {
    updateUser(
      input: {
        where: { id: $id }
        data: { isActivitiesCoursesPublic: $isActivitiesCoursesPublic }
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_CONTACT_INFO_PREF = gql`
  mutation updateUserContactInfoPref($id: ID!, $isContactInfoPublic: Boolean!) {
    updateUser(
      input: {
        where: { id: $id }
        data: { isContactInfoPublic: $isContactInfoPublic }
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation updateUserPassword($id: ID!, $password: String!) {
    updateUser(input: { where: { id: $id }, data: { password: $password } }) {
      user {
        id
      }
    }
  }
`;
