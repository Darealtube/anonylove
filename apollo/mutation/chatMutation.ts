import { gql } from "@apollo/client/core";

// SENDING MESSAGE IN CHAT
export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chat: ID!
    $sender: ID!
    $message: String!
    $anonymous: Boolean!
    $repliesTo: ID
  ) {
    sendMessage(
      chat: $chat
      sender: $sender
      message: $message
      anonymous: $anonymous
      repliesTo: $repliesTo
    )
  }
`;

// READING CHAT
export const SEEN_CHAT = gql`
  mutation seeMessage($person: String!, $chat: ID!) {
    seenChat(person: $person, chat: $chat)
  }
`;

// SENDING AN END REQUEST IN CHAT
export const END_CHAT_REQUEST = gql`
  mutation SendEndReq($chat: ID!, $requester: ID!) {
    endChatRequest(chat: $chat, requester: $requester)
  }
`;

// REJECTING END REQUEST
export const REJECT_END_CHAT_REQUEST = gql`
  mutation RejectEnd($chat: ID!) {
    rejectEndChat(chat: $chat)
  }
`;

// ACCEPTING END REQUEST
export const ACCEPT_END_CHAT_REQUEST = gql`
  mutation AcceptEnd($chat: ID!) {
    acceptEndChat(chat: $chat)
  }
`;

// ENDS CHAT WHEN END REQUEST IS ACCEPTED
export const END_CHAT = gql`
  mutation EndChat($chat: ID!) {
    endChat(chat: $chat)
  }
`;
