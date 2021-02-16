import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
  mutation(
    $StudentNameInArabic: String!
    $StudentOfficialEmail: String!
    $sid: String!
    $NationalID: String!
    $group: ID!
  ) {
    createStudent(
      input: {
        data: {
          sid: $sid
          StudentNameInArabic: $StudentNameInArabic
          StudentOfficialEmail: $StudentOfficialEmail
          NationalID: $NationalID
          group: $group
        }
      }
    ) {
      student {
        NationalID
        StudentNameInArabic
        id
        StudentOfficialEmail
        sid
      }
    }
  }
`;
