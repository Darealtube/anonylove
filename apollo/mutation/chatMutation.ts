import { gql } from "@apollo/client/core";

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

export const SEEN_CHAT = gql`
  mutation seeMessage($person: String!, $chat: ID!) {
    seenChat(person: $person, chat: $chat) {
      anonLastSeen
      confesseeLastSeen
    }
  }
`;
