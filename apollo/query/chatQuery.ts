import { gql } from "apollo-server-micro";

export const GET_USER_ACTIVE_CHAT = gql`
  query GetUserActiveChat($name: String!) {
    getUserActiveChat(name: $name) {
      _id
      confessee {
        _id
        name
        image
      }
      updatedAt
    }
  }
`;
