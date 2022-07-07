import { gql } from "@apollo/client/core";

export const NEW_MSG_SUBSCRIPTION = gql`
  subscription newMessage($chat: ID!) {
    newMessage(chat: $chat) {
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
