import { initializeApollo } from "../../apollo/apolloClient";
import { GET_USER_QUERY } from "../../apollo/query/userQuery";

export const getUser = async (name: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUser },
  } = await apolloClient.query({
    query: GET_USER_QUERY,
    variables: {
      name,
    },
  });

  return { data: apolloClient, exists: getUser };
};
