import { gql } from "apollo-server-micro";

export const SEND_CONFESSION_REQUEST = gql`
  mutation SendConfessionRequest($sender: String!, $receiver: String!) {
    sendConfessionRequest(sender: $sender, receiver: $receiver) {
      _id
      accepted
      date
      sender {
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
      confesser {
        _id
        name
        image
      }
      confessee {
        _id
        name
        image
      }
    }
  }
`;
