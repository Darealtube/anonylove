export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  cover?: string;
  bio?: string;
  status?: string;
  sentConfessionRequests: RequestConnection;
  receivedConfessionRequests: RequestConnection[];
}

export interface Request {
  id: string;
  date: Date;
  sender: string;
  receiver: string;
  acceepted: boolean;
}

type RequestConnection = {
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
  id: string;
  date: Date;
  sender: User;
  message: string;
  favorite: boolean;
}

export interface Chat {
  id: string;
  confesser: User;
  confessee: User;
  messages: Message[];
}
