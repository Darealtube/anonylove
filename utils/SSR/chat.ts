import { initializeApollo } from "../../apollo/apolloClient";
import { GET_USER_ACTIVE_CHAT } from "../../apollo/query/chatQuery";

export const getUserActiveChat = async (name: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUserActiveChat },
  } = await apolloClient.query({
    query: GET_USER_ACTIVE_CHAT,
    variables: {
      name,
    },
  });

  return { data: apolloClient, exists: getUserActiveChat };
};
