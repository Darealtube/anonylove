import { gql } from "@apollo/client/core";

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
      anonSeen
      confesseeSeen
      expiresAt
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const REVEAL_USER_CHAT = gql`
  query RevealUserChat($name: String!) {
    getUserActiveChat(name: $name) {
      _id
      anonymous {
        _id
        name
        image
      }
      expiresAt
    }
  }
`;
