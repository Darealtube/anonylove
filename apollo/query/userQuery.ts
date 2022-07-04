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
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
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
  query EditProfileInfo($id: ID!) {
    getProfile(id: $id) {
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
  query ProfileChat($id: ID!) {
    getProfile(id: $id) {
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
          sender {
            _id
            name
          }
        }
        startedAt
        expiresAt
        anonSeen
        confesseeSeen
        updatedAt
      }
      notifSeen
    }
  }
`;

export const GET_PROFILE_RECEIVED_REQUESTS = gql`
  query ProfileRequests($id: ID!, $after: String, $limit: Int) {
    getProfile(id: $id) {
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
  query ProfileSentRequests($id: ID!, $after: String, $limit: Int) {
    getProfile(id: $id) {
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
  query ProfileNotifications($id: ID!, $after: String, $limit: Int) {
    getProfile(id: $id) {
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
