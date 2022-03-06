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
  chats: ChatConnection;
}

export interface Request {
  _id: string;
  date: Date;
  sender: User;
  receiver: User;
  accepted: boolean;
}

export type RequestConnection = {
  totalCount: number;
  pageInfo: PageInfo;
  edges: [RequestEdge];
};

type RequestEdge = {
  node: Request;
};

type PageInfo = {
  endCursor: string;
  hasNextPage: boolean;
};

export interface Message {
  _id: string;
  date: Date;
  sender: User;
  message: string;
  favorite: boolean;
}

export interface Chat {
  _id: string;
  updatedAt: Date;
  confesser: User;
  confessee: User;
  messages: Message[];
}

export type ChatConnection = {
  totalCount: number;
  pageInfo: PageInfo;
  edges: [ChatEdge];
};

export type ChatEdge = {
  node: Chat;
};
