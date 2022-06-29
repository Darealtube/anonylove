import { gql } from "@apollo/client";

export const NEW_NOTIF_SUBSCRIPTION = gql`
  subscription NotifSeen($receiver: ID!) {
    notifSeen(receiver: $receiver)
  }
`;
