import { gql } from "@apollo/client";

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notifID: ID!) {
    deleteNotification(notifID: $notifID)
  }
`;

export const SEE_NOTIFICATION = gql`
  mutation SeeNotification($profileId: ID!) {
    seeNotification(profileId: $profileId)
  }
`;
