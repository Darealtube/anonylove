import { gql } from "@apollo/client/core";

// EVERY USER HAS A UNIQUE TAG WHENEVER THEY CREATE A NEW ACCOUNT.
export const CREATE_UNIQUE_TAG = gql`
  mutation CreateUniqueTag($userId: ID!, $name: String!) {
    createUniqueTag(userId: $userId, name: $name)
  }
`;
