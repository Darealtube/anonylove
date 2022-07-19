import { initializeApollo } from "../../apollo/apolloClient";
import {
  EDIT_PROFILE_QUERY,
  GET_PROFILE_QUERY,
  GET_USER_QUERY,
} from "../../apollo/query/userQuery";

export const getUserInfo = async (name: string, sessionId: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getUser },
  } = await apolloClient.query({
    query: GET_USER_QUERY,
    variables: { name, from: sessionId },
  });
  const ownProfile = sessionId === getUser?._id;
  const youSentRequest = getUser?.userSentRequest;
  return { data: apolloClient, exists: getUser, youSentRequest, ownProfile };
};

export const getProfileInfo = async (id: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getProfile },
  } = await apolloClient.query({
    query: GET_PROFILE_QUERY,
    variables: { profileId: id },
  });
  return { data: apolloClient, exists: getProfile };
};

export const editProfileInfo = async (id: string) => {
  const apolloClient = initializeApollo();
  const {
    data: { getProfile },
  } = await apolloClient.query({
    query: EDIT_PROFILE_QUERY,
    variables: { profileId: id },
  });
  return { data: apolloClient, exists: getProfile };
};
