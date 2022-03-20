import { gql } from "apollo-server-micro";

export const GET_USER_ACTIVE_CHAT = gql`
  query GetUserActiveChat($name: String!, $after: String, $limit: Int) {
    getUserActiveChat(name: $name) {
      _id
      confessee {
        _id
        name
        image
      }
      updatedAt
      anonLastSeen
      confesseeLastSeen
      messages(after: $after, limit: $limit) {
        totalCount
        edges {
          node {
            _id
            sender {
              _id
              name
              image
            }
            anonymous
            message
            date
          }
        }
      }
    }
  }
`;
