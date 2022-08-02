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
    variables: { profileId: id, limit: 10 },
    context: { Authorization: id },
  });
  return { data: apolloClient, exists: getProfileActiveChat };
};

export const revealChatInfo = async (id: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getProfileActiveChat },
  } = await apolloClient.query({
    query: REVEAL_USER_CHAT,
    variables: { profileId: id },
    context: { Authorization: id },
  });

  return {
    data: apolloClient,
    exists: getProfileActiveChat,
    ended: getProfileActiveChat.chatEnded,
  };
};
