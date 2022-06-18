export interface NewMessageData {
  data: {
    newMessage: NewMessage;
  };
}

export interface NewMessage {
  date: string;
  message: string;
  _id: string;
}

export interface SeenChatData {
  data: {
    seenChat: SeenChat;
  };
}

export interface SeenChat {
  anonSeen: boolean;
  confesseeSeen: boolean;
  updatedAt: number;
}
