import { gql } from "@apollo/client/core";

export const GET_USER_QUERY = gql`
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

export const GET_USER_SOCIALS = gql`
  query UserConfessionRequests($name: String!, $after: String, $limit: Int) {
    getUser(name: $name) {
      _id
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
        }
        anonLastSeen
        confesseeLastSeen
        updatedAt
      }
    }
  }
`;
