import { gql } from "@apollo/client/core";

export const GET_USER_QUERY = gql`
  query GetUser($name: String!, $from: String) {
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

export const EDIT_USER_QUERY = gql`
  query GetUser($name: String!) {
    getUser(name: $name) {
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

export const GET_USER_CHAT = gql`
  query UserChat($name: String!) {
    getUser(name: $name) {
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
        expiresAt
        anonSeen
        confesseeSeen
        updatedAt
      }
      notifSeen
    }
  }
`;

export const GET_USER_RECEIVED_REQUESTS = gql`
  query UserReceivedRequests($name: String!, $after: String, $limit: Int) {
    getUser(name: $name) {
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

export const GET_USER_SENT_REQUESTS = gql`
  query UserSentRequests($name: String!, $after: String, $limit: Int) {
    getUser(name: $name) {
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

export const GET_USER_NOTIFICATIONS = gql`
  query UserNotifications($name: String!, $after: String, $limit: Int) {
    getUser(name: $name) {
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
