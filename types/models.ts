export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  cover?: string;
  bio?: string;
  status?: string;
  activeChat?: Chat;
  notifSeen?: boolean;
  sentConfessionRequests: QueryConnection<Request>;
  receivedConfessionRequests: QueryConnection<Request>;
  sentUserRequest: Boolean;
  userNotifications: QueryConnection<NotificationModel>;
}

export interface Request {
  _id: string;
  date: Date;
  anonymous: User;
  receiver: User;
  accepted: boolean;
}

export interface Message {
  _id: string;
  chat: string;
  date: Date;
  sender: User;
  message: string;
  anonymous: boolean;
  endRequestMsg: boolean;
}

export interface Chat {
  _id: string;
  anonSeen: boolean;
  confesseeSeen: boolean;
  anonymous: User;
  confessee: User;
  messages: QueryConnection<Message>;
  latestMessage: Message;
  endAttempts: number;
  chatEnded: boolean;
  expireChatAt: number;
}

export interface NotificationModel {
  _id: string;
  date: Date;
  receiver: User;
}

export interface QueryConnection<T> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: [QueryEdge<T>];
}

export interface QueryEdge<T> {
  node: T;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}
