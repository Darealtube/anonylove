import { User } from "./models";

export type getUserVariables = {
  name: string;
};

export type getUserResult = {
  getUser: User;
};

export type searchUserResult = {
  searchUser: User[];
};

export type searchUserVariables = {
  key: string;
};
