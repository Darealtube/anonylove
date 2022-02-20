import { gql } from "@apollo/client";

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
