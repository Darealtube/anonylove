import { Message, User } from "./models";

export interface NewMessage {
  date: string;
  message: string;
  _id: string;
  endRequestMsg: boolean;
  sender: User;
  chat: string;
  anonymous: boolean;
  repliesTo: Message;
}

export interface SeenChat {
  _id: string;
  anonSeen: boolean;
  confesseeSeen: boolean;
}

export interface SubscriptionData<T> {
  data: {
    [key: string]: T;
  };
}
