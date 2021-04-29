import { gql } from '@apollo/client';

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    upload(file: $file) {
      id
      url
    }
  }
`;
