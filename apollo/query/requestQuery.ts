import { gql } from "@apollo/client";

export const GET_USER_CONFESSION_REQUESTS = gql`
  query UserConfessionRequests($name: String!, $after: ID, $limit: Int) {
    getUser(name: $name) {
      _id
      sentConfessionRequests(limit: $limit, after: $after) {
        edges {
          node {
            _id
            accepted
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
