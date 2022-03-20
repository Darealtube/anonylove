import { Chat, User } from "./models";

export interface GetUserVariables {
  name: string;
}

export interface GetUserResult {
  getUser: User;
}

export interface searchUserResult {
  searchUser: User[];
}

export interface searchUserVariables {
  key: string;
}

export interface getUserChatResult {
  getUserActiveChat: Chat;
}

export interface getUserChatVariables {
  name: string;
  after?: string;
  limit?: number;
}
