import { gql } from "@apollo/client/core";

export const EDIT_USER_PROFILE = gql`
  mutation EditUser(
    $originalName: String!
    $name: String!
    $image: String
    $cover: String
    $bio: String
    $status: String
  ) {
    editUser(
      originalName: $originalName
      name: $name
      image: $image
      cover: $cover
      bio: $bio
      status: $status
    )
  }
`;
