import { gql } from "@apollo/client/core";

export const GET_PROFILE_ACTIVE_CHAT = gql`
  query GetProfileActiveChat($profileId: ID!, $after: String, $limit: Int) {
    getProfileActiveChat(profileId: $profileId) {
      _id
      confessee {
        _id
        name
        image
      }
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
  query RevealUserChat($profileId: ID!) {
    getProfileActiveChat(profileId: $profileId) {
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
