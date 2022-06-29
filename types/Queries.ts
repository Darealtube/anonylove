import { Chat, User } from "./models";

export interface GetProfileVariables {
  id: string;
  from?: string;
  limit?: number;
  after?: string;
}

export interface GetUserVariables {
  name: string;
  from?: string;
  limit?: number;
  after?: string;
}

export interface GetUserResult {
  getUser: User;
}

export interface GetProfileResult {
  getProfile: User;
}

export interface searchUserResult {
  searchUser: User[];
}

export interface searchUserVariables {
  key: string;
}

export interface getProfileChatResult {
  getProfileActiveChat: Chat;
}

export interface getProfileChatVariables {
  id: string;
  after?: string;
  limit?: number;
}
