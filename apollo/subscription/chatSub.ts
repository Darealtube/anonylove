import { gql } from "@apollo/client";

export const PROFILE_CHAT_SUBSCRIPTION = gql`
  subscription ProfileChat($user: ID!) {
    profileChat(user: $user) {
      _id
      latestMessage {
        _id
        message
      }
      expiresAt
      anonSeen
      confesseeSeen
    }
  }
`;

export const CHAT_SEEN_SUBSCRIPTION = gql`
  subscription ProfileChat($user: ID!) {
    profileChat(user: $user) {
      _id
      anonSeen
      confesseeSeen
    }
  }
`;
