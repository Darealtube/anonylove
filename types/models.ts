export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  cover?: string;
  bio?: string;
  status?: string;
  sentConfessionRequests: RequestConnection;
  receivedConfessionRequests: RequestConnection;
  activeChat?: Chat;
}

export interface Request {
  _id: string;
  date: Date;
  anonymous: User;
  receiver: User;
  accepted: boolean;
}

export interface RequestConnection {
  totalCount: number;
  pageInfo: PageInfo;
  edges: [RequestEdge];
}

interface RequestEdge {
  node: Request;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface Message {
  _id: string;
  chat: string;
  date: Date;
  sender: User;
  message: string;
  anonymous: boolean;
  expiresAt: number;
}

export interface MessageConnection {
  totalCount: number;
  pageInfo: PageInfo;
  edges: [MessageEdge];
}

export interface MessageEdge {
  node: Message;
}

export interface Chat {
  _id: string;
  updatedAt: number;
  anonSeen: boolean;
  confesseeSeen: boolean;
  anonymous: User;
  confessee: User;
  messages: MessageConnection;
  latestMessage: Message;
  expiresAt: number;
}
