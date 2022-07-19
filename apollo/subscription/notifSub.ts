import { gql } from "@apollo/client";

export const NEW_NOTIF_SUBSCRIPTION = gql`
  subscription NotifSeen($profileId: ID!) {
    notifSeen(profileId: $profileId)
  }
`;
