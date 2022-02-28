import { gql } from "@apollo/client";

export const GET_USER_CONFESSION_REQUESTS = gql`
  query UserConfessionRequests($name: String!, $after: ID, $limit: Int) {
    getUser(name: $name) {
      _id
      receivedConfessionRequests(limit: $limit, after: $after) {
        edges {
          node {
            _id
            accepted
            date
            sender {
              name
              image
            }
            receiver {
              name
              image
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
