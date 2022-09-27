import { gql } from "@apollo/client/core";

// THIS GETS THE USER'S ACTIVE CHAT SHOWN IN THE MAIN /activeChat PAGE
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
      expireChatAt
      status {
        chatEnded
        endAttempts
        endRequester
        endRequesting
      }
      messages(after: $after, limit: $limit) {
        totalCount
        edges {
          node {
            _id
            chat
            sender {
              _id
              name
              image
            }
            anonymous
            message
            date
            repliesTo {
              _id
              message
            }
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

// REVEALS USER WHEN END REQUEST IS ACCEPTED
export const REVEAL_USER_CHAT = gql`
  query RevealUserChat($profileId: ID!) {
    getProfileActiveChat(profileId: $profileId) {
      _id
      anonymous {
        _id
        name
        image
      }
      status {
        chatEnded
      }
    }
  }
`;
