import { gql } from '@apollo/client';

export const GET_ACADEMIC_YEARS = gql`
  query {
    groupsConnection {
      groupBy {
        GroupNumber {
          key
        }
      }
      values {
        academic_year {
          AcademicYearInArabic
        }
        GroupNumber
        id
        students {
          sid
        }
      }
    }
  }
`;
