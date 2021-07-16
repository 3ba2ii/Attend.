import { gql } from '@apollo/client';

export const GET_STUDENT_BY_NATIONAL_ID = gql`
  query getStudentWithNationalID($NationalID: String!) {
    students(where: { NationalID: $NationalID }) {
      id
    }
  }
`;
