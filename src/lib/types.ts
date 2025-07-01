export interface Message {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
}

export interface User {
  id: string;
  username: string;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (data: {
    message: string;
    userId: string;
    username: string;
    roomId: string;
  }) => void;
  typing_start: (data: { userId: string; username: string; roomId: string }) => void;
  typing_stop: (data: { userId: string; username: string; roomId: string }) => void;
}

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  joined_room: (roomId: string) => void;
  left_room: (roomId: string) => void;
  user_typing: (data: TypingIndicator) => void;
  connect: () => void;
  disconnect: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}
