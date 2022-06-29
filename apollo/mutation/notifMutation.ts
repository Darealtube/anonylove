import { gql } from "@apollo/client";

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notifID: ID!) {
    deleteNotification(notifID: $notifID)
  }
`;

export const SEEN_NOTIFICATION = gql`
  mutation SeenNotification($userId: ID!) {
    seenNotification(userId: $userId)
  }
`;
