export interface NewMessage {
  date: string;
  message: string;
  _id: string;
  endRequestMsg: boolean;
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
