export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  cover?: string;
  bio?: string;
  status?: string;
}

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
