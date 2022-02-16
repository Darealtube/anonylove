import { gql } from "apollo-server-micro";

export const SEARCH_USER_QUERY = gql`
  query searchUser($key: String) {
    searchUser(key: $key) {
      _id
      name
      image
      email
    }
  }
`;
