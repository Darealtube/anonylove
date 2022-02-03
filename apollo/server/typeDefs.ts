import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    image: String
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    createUser(name: String, email: String): Boolean
  }
`;
