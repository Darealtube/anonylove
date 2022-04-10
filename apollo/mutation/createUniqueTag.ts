import { gql } from "@apollo/client/core";

export const CREATE_UNIQUE_TAG = gql`
  mutation CreateUniqueTag($userId: ID!, $name: String!) {
    createUniqueTag(userId: $userId, name: $name)
  }
`;
