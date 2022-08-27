import { DateTime } from "luxon";
import { initializeApollo } from "../../apollo/apolloClient";
import { ACCEPT_END_CHAT_REQUEST as EXPIRE_CHAT } from "../../apollo/mutation/chatMutation";
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

  if (
    DateTime.utc().toMillis() >= getProfileActiveChat.expireChatAt &&
    !getProfileActiveChat.chatEnded
  ) {
    await apolloClient.mutate({
      mutation: EXPIRE_CHAT,
      variables: { chat: getProfileActiveChat._id },
      context: { Authorization: id },
    });
    return {
      data: apolloClient,
      exists: getProfileActiveChat,
      chatId: getProfileActiveChat._id,
      ended: true,
    };
  }
  return {
    data: apolloClient,
    exists: getProfileActiveChat,
    chatId: getProfileActiveChat._id,
    ended: false,
  };
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
    ended: getProfileActiveChat.status.chatEnded,
  };
};
