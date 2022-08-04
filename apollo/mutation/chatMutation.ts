import { gql } from "@apollo/client/core";

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chat: ID!
    $sender: ID!
    $message: String!
    $anonymous: Boolean!
  ) {
    sendMessage(
      chat: $chat
      sender: $sender
      message: $message
      anonymous: $anonymous
    )
  }
`;

export const SEEN_CHAT = gql`
  mutation seeMessage($person: String!, $chat: ID!) {
    seenChat(person: $person, chat: $chat)
  }
`;

export const END_CHAT_REQUEST = gql`
  mutation SendEndReq($chat: ID!, $sender: ID!, $anonymous: Boolean!) {
    endChatRequest(chat: $chat, sender: $sender, anonymous: $anonymous) {
      _id
      sender {
        _id
        name
        image
      }
      message
      date
      anonymous
      endRequestMsg
    }
  }
`;

export const REJECT_END_CHAT_REQUEST = gql`
  mutation RejectEnd($chat: ID!, $sender: ID!, $anonymous: Boolean!) {
    rejectEndChat(chat: $chat, sender: $sender, anonymous: $anonymous) {
      _id
      sender {
        _id
        name
        image
      }
      message
      date
      anonymous
      endRequestMsg
    }
  }
`;

export const ACCEPT_END_CHAT_REQUEST = gql`
  mutation AcceptEnd($chat: ID!) {
    acceptEndChat(chat: $chat)
  }
`;

export const END_CHAT = gql`
  mutation EndChat($chat: ID!) {
    endChat(chat: $chat)
  }
`;
