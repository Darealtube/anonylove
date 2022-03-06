import { gql } from "@apollo/client";

export const GET_USER_CHATS = gql`
  query UserChats($name: String!, $after: String, $limit: Int) {
    getUser(name: $name) {
      _id
      chats(limit: $limit, after: $after) {
        edges {
          node {
            _id
            confesser {
              _id
              name
              image
            }
            confessee {
              _id
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
