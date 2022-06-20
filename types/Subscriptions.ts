export interface NewMessage {
  date: string;
  message: string;
  _id: string;
}

export interface SeenChat {
  anonSeen: boolean;
  confesseeSeen: boolean;
  updatedAt: number;
}

export interface SubscriptionData<T> {
  data: {
    [key: string]: T;
  };
}
