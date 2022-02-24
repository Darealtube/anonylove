import { gql } from "apollo-server-micro";

export const SEND_CONFESSION_REQUEST = gql`
  mutation SendConfessionRequest($sender: String!, $receiver: String!) {
    sendConfessionRequest(sender: $sender, receiver: $receiver) {
      _id
      accepted
      date
      sender
      receiver
    }
  }
`;

export const CONFESSION_REQUEST_ACTION = gql`
  mutation ConfessionRequestAction($requestID: ID!, $accepted: Boolean!) {
    confessionRequestAction(requestID: $requestID, accepted: $accepted)
  }
`;
