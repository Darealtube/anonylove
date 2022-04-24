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
