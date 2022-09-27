import { gql } from "@apollo/client";

// CHAT INFO SUBSCRIPTION FOR THE SIDEBAR
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

// LISTENS IF ANONYMOUS OR CONFESSER HAVE SEEN THE CHAT
export const CHAT_SEEN_SUBSCRIPTION = gql`
  subscription ProfileChat($profileId: ID!) {
    profileChat(profileId: $profileId) {
      _id
      anonSeen
      confesseeSeen
    }
  }
`;

// LISTENS IF CHAT IS ENDED OR END REQUESTING
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
