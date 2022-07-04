import { DateTime } from "luxon";
import { initializeApollo } from "../../apollo/apolloClient";
import {
  GET_PROFILE_ACTIVE_CHAT,
  REVEAL_USER_CHAT,
} from "../../apollo/query/chatQuery";

export const getUserActiveChat = async (id: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getProfileActiveChat },
  } = await apolloClient.query({
    query: GET_PROFILE_ACTIVE_CHAT,
    variables: { id, limit: 10 },
  });
  return { data: apolloClient, exists: getProfileActiveChat };
};

export const revealChatInfo = async (id: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getProfileActiveChat },
  } = await apolloClient.query({
    query: REVEAL_USER_CHAT,
    variables: { id },
  });

  const expired =
    DateTime.utc().toMillis() > (getProfileActiveChat?.expiresAt as number);

  return {
    data: apolloClient,
    exists: getProfileActiveChat,
    expired,
  };
};
