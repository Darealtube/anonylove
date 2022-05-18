import { DateTime } from "luxon";
import { initializeApollo } from "../../apollo/apolloClient";
import {
  GET_USER_ACTIVE_CHAT,
  REVEAL_USER_CHAT,
} from "../../apollo/query/chatQuery";

export const getUserActiveChat = async (name: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUserActiveChat },
  } = await apolloClient.query({
    query: GET_USER_ACTIVE_CHAT,
    variables: {
      name,
      limit: 10,
    },
  });

  return { data: apolloClient, exists: getUserActiveChat };
};

export const revealChatInfo = async (name: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUserActiveChat },
  } = await apolloClient.query({
    query: REVEAL_USER_CHAT,
    variables: {
      name,
    },
  });

  const expired =
    DateTime.local().toMillis() > (getUserActiveChat?.expiresAt as number);

  return {
    data: apolloClient,
    exists: getUserActiveChat,
    expired,
    chatId: getUserActiveChat._id,
  };
};
