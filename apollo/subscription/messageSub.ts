import { gql } from "@apollo/client/core";

export const NEW_MSG_SUBSCRIPTION = gql`
  subscription newMessage {
    newMessage {
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
`;

export const NEW_SENT_REQUEST_SUBSCRIPTION = gql`
  subscription newSentRequest {
    newSentRequest {
      _id
      date
      anonymous {
        name
        image
      }
      receiver {
        name
        image
      }
    }
  }
`;

export const SEEN_CHAT_SUBSCRIPTION = gql`
  subscription seenChat {
    seenChat {
      _id
      confessee {
        _id
        name
        image
      }
      latestMessage {
        _id
        message
      }
      anonSeen
      confesseeSeen
      updatedAt
      expiresAt
    }
  }
`;
