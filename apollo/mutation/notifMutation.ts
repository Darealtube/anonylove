import { gql } from "@apollo/client";

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notifID: ID!) {
    deleteNotification(notifID: $notifID)
  }
`;

export const SEEN_NOTIFICATION = gql`
  mutation SeenNotification($userName: String!) {
    seenNotification(userName: $userName)
  }
`;
