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
    sentConfessionRequests(limit: Int, after: String): RequestConnection
    receivedConfessionRequests(limit: Int, after: String): RequestConnection
    chats(limit: Int, after: String): ChatConnection
  }

  type Request {
    _id: ID!
    sender: User!
    receiver: User!
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

  type Chat {
    _id: ID!
    confesser: User!
    confessee: User!
    updatedAt: String
    messages: [ID]
  }

  type ChatConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [ChatEdge]
  }

  type ChatEdge {
    node: Chat
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
    rejectConfessionRequest(requestID: ID!): Boolean
    acceptConfessionRequest(requestID: ID!): Chat
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
