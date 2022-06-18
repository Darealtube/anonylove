import { initializeApollo } from "../../apollo/apolloClient";
import { GET_USER_QUERY } from "../../apollo/query/userQuery";

export const getUserInfo = async (name: string, sessionName: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUser },
  } = await apolloClient.query({
    query: GET_USER_QUERY,
    variables: {
      name,
      from: sessionName,
    },
  });
  const youSentRequest = getUser?.userSentRequest;
  return { data: apolloClient, exists: getUser, youSentRequest };
};
