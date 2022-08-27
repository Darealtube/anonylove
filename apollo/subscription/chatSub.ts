import { gql } from "@apollo/client";

export const PROFILE_CHAT_SUBSCRIPTION = gql`
  subscription ProfileChat($profileId: ID!) {
    profileChat(profileId: $profileId) {
      _id
      latestMessage {
        _id
        message
      }
      anonSeen
      confesseeSeen
    }
  }
`;

export const CHAT_SEEN_SUBSCRIPTION = gql`
  subscription ProfileChat($profileId: ID!) {
    profileChat(profileId: $profileId) {
      _id
      anonSeen
      confesseeSeen
    }
  }
`;

export const CHAT_STATUS_SUBSCRIPTION = gql`
  subscription ChatStatus($chatId: ID!) {
    activeChatStatus(chatId: $chatId) {
      _id
      status {
        chatEnded
        endAttempts
        endRequester
        endRequesting
      }
    }
  }
`;
