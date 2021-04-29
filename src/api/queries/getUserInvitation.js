import { gql } from '@apollo/client';

export const GET_USER_INVITATION_INFO = gql`
  query userInvitation($id: ID!) {
    users {
      username
    }
    userInvitation(id: $id) {
      id
      latest_invitation_time
      isUsed
      email
      role {
        name
        id
        users {
          LecturerNameInEnglish
        }
      }
      department {
        DepartmentNameInEnglish
        id
      }
    }
  }
`;
