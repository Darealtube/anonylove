import { gql } from "@apollo/client";

export const PROFILE_CHAT_SUBSCRIPTION = gql`
  subscription ProfileChat($user: ID!) {
    profileChat(user: $user) {
      _id
      latestMessage {
        _id
        message
        sender {
          _id
          name
        }
      }
      startedAt
      expiresAt
      anonSeen
      confesseeSeen
      updatedAt
    }
  }
`;
