import { gql } from "@apollo/client/core";

// SENDS CONFESSION REQUEST TO A USER
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

// DELETES CONFESSION REQUEST
export const REJECT_CONFESSION_REQUEST = gql`
  mutation RejectConfessionRequest($requestID: ID!) {
    rejectConfessionRequest(requestID: $requestID)
  }
`;

// ACCEPTS THE REQUEST AND CREATES A NEW CHAT 
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
      anonSeen
      confesseeSeen
    }
  }
`;
