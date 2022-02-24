import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    image: String
    cover: String
    bio: String
    status: String
    sentConfessionRequests(limit: Int, after: ID): RequestConnection
    receivedConfessionRequests(limit: Int, after: ID): RequestConnection
  }

  type Request {
    _id: ID!
    sender: ID!
    receiver: ID!
    date: String
    accepted: Boolean
  }

  type RequestConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [RequestEdge]
  }

  type RequestEdge {
    node: Request
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean
  }

  type Query {
    getUser(name: String!): User
    searchUser(key: String): [User]
  }

  type Mutation {
    createUser(name: String, email: String): Boolean
    createUniqueTag(userId: ID!, name: String!): Boolean
    sendConfessionRequest(sender: String!, receiver: String!): Request
    confessionRequestAction(requestID: ID!, accepted: Boolean!): Request
    editUser(
      originalName: String!
      name: String!
      image: String
      cover: String
      bio: String
      status: String
    ): Boolean
  }
`;
