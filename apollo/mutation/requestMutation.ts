import { gql } from "@apollo/client/core";

export const SEND_CONFESSION_REQUEST = gql`
  mutation SendConfessionRequest($anonymous: ID!, $receiver: ID!) {
    sendConfessionRequest(anonymous: $anonymous, receiver: $receiver) {
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

export const REJECT_CONFESSION_REQUEST = gql`
  mutation RejectConfessionRequest($requestID: ID!) {
    rejectConfessionRequest(requestID: $requestID)
  }
`;

export const ACCEPT_CONFESSION_REQUEST = gql`
  mutation AcceptConfessionRequest($requestID: ID!) {
    acceptConfessionRequest(requestID: $requestID) {
      _id
      anonymous {
        _id
        name
        image
      }
      confessee {
        _id
        name
        image
      }
      latestMessage {
        _id
        message
        sender {
          _id
          name
        }
      }
      expiresAt
      anonSeen
      confesseeSeen
    }
  }
`;
