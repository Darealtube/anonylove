import { gql } from "@apollo/client/core";

export const GET_USER_QUERY = gql`
  query GetUser($name: String!, $from: ID!) {
    getUser(name: $name) {
      _id
      name
      email
      image
      cover
      bio
      status
      userSentRequest(from: $from)
    }
  }
`;

export const GET_PROFILE_QUERY = gql`
  query GetProfile($profileId: ID!) {
    getProfile(profileId: $profileId) {
      _id
      name
      email
      image
      cover
      bio
      status
    }
  }
`;

export const EDIT_PROFILE_QUERY = gql`
  query EditProfileInfo($profileId: ID!) {
    getProfile(profileId: $profileId) {
      _id
      name
      email
      image
      cover
      bio
      status
    }
  }
`;

export const GET_PROFILE_CHAT = gql`
  query ProfileChat($profileId: ID!) {
    getProfile(profileId: $profileId) {
      _id
      activeChat {
        _id
        confessee {
          _id
          name
          image
        }
        latestMessage {
          _id
          message
          anonymous
        }
        expiresAt
        anonSeen
        confesseeSeen
      }
      notifSeen
    }
  }
`;

export const GET_PROFILE_RECEIVED_REQUESTS = gql`
  query ProfileRequests($profileId: ID!, $after: String, $limit: Int) {
    getProfile(profileId: $profileId) {
      _id
      activeChat {
        _id
      }
      receivedConfessionRequests(limit: $limit, after: $after) {
        edges {
          node {
            _id
            date
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_PROFILE_SENT_REQUESTS = gql`
  query ProfileSentRequests($profileId: ID!, $after: String, $limit: Int) {
    getProfile(profileId: $profileId) {
      _id
      sentConfessionRequests(limit: $limit, after: $after) {
        edges {
          node {
            _id
            date
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_PROFILE_NOTIFICATIONS = gql`
  query ProfileNotifications($profileId: ID!, $after: String, $limit: Int) {
    getProfile(profileId: $profileId) {
      _id
      userNotifications(limit: $limit, after: $after) {
        edges {
          node {
            _id
            date
            receiver {
              _id
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_PROFILE_STATUS = gql`
  query ProfileStatus($profileId: ID!) {
    getProfile(profileId: $profileId) {
      _id
      activeChat {
        _id
        confessee {
          _id
        }
        anonSeen
        confesseeSeen
      }
      notifSeen
    }
  }
`;
