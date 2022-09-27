import { gql } from "@apollo/client";

// DELETES NOTIFICATION
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notifID: ID!) {
    deleteNotification(notifID: $notifID)
  }
`;

// READS NOTIFICATIONS 
export const SEE_NOTIFICATION = gql`
  mutation SeeNotification($profileId: ID!) {
    seeNotification(profileId: $profileId)
  }
`;
