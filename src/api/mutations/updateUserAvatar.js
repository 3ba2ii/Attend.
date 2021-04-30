import { gql } from '@apollo/client';

export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($id: ID = "", $avatar: ID = "") {
    updateUser(input: { where: { id: $id }, data: { avatar: $avatar } }) {
      user {
        id
      }
    }
  }
`;
