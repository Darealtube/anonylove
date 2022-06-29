import { gql } from "@apollo/client/core";

export const GET_PROFILE_ACTIVE_CHAT = gql`
  query GetProfileActiveChat($id: ID!, $after: String, $limit: Int) {
    getProfileActiveChat(id: $id) {
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
  query RevealUserChat($id: ID!) {
    getProfileActiveChat(id: $id) {
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
