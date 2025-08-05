import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ReceivedMessage {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
}

interface UseSocketResult {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: { message: string; roomId: string; userId?: string }) => void;
  roomHistory: ReceivedMessage[];
}

export const useSocket = (serverUrl: string): UseSocketResult => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomHistory, setRoomHistory] = useState<ReceivedMessage[]|any[]>([]);

  useEffect(() => {
    const newSocket = io(serverUrl, { transports: ['websocket'] });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      setError(`Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (err) => {
      setError(`Connection Error: ${err.message}`);
    });
    newSocket.on('join_room', (data: { roomId: string; messages: ReceivedMessage[] }) => {
      console.log(`Successfully joined room: ${data.roomId}`);
      setRoomHistory(data.messages);
      console.log("data.history:",data)
    });

    newSocket.on('left_room', (roomId: string) => {
      console.log(`Successfully left room: ${roomId}`);
      setRoomHistory([]);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_room', roomId);
    } else {
      setError('Socket not connected. Please try again.');
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_room', roomId);
    }
  };

  const sendMessage = (data: { message: string; roomId: string; userId?: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', data);
    } else {
      setError('Socket not connected. Cannot send message.');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    joinRoom,
    leaveRoom,
    sendMessage,
    roomHistory,
  };
};
