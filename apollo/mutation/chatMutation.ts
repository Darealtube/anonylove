import { gql } from "apollo-server-micro";

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chat: ID!
    $sender: String!
    $message: String!
    $anonymous: Boolean!
  ) {
    sendMessage(
      chat: $chat
      sender: $sender
      message: $message
      anonymous: $anonymous
    ) {
      _id
      sender {
        _id
        name
        image
      }
      message
      date
      anonymous
    }
  }
`;
