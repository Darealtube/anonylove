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
    activeChat: Chat
  }

  type Request {
    _id: ID!
    anonymous: User!
    receiver: User!
    date: String
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
    anonymous: User!
    confessee: User!
    updatedAt: String
    messages(limit: Int, after: String): MessageConnection
  }

  type Message {
    _id: ID!
    chat: ID!
    date: String!
    sender: User
    message: String!
    anonymous: Boolean
  }

  type MessageConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [MessageEdge]
  }

  type MessageEdge {
    node: Message
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean
  }

  type Query {
    getUser(name: String!): User
    searchUser(key: String): [User]
    getUserActiveChat(name: String!): Chat
  }

  type Mutation {
    createUser(name: String, email: String): Boolean
    createUniqueTag(userId: ID!, name: String!): Boolean
    sendConfessionRequest(anonymous: String!, receiver: String!): Request
    rejectConfessionRequest(requestID: ID!): Boolean
    acceptConfessionRequest(requestID: ID!): Chat
    sendMessage(
      chat: ID!
      sender: String!
      message: String!
      anonymous: Boolean!
    ): Message
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
