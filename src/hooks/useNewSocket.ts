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

}

export const useSocket = (serverUrl: string): UseSocketResult => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(serverUrl, {
      transports: ['websocket'], // Prefer WebSocket for better performance
      // You can add other options here if needed, e.g., auth tokens
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
      setError(`Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setError(`Connection Error: ${err.message}`);
    });


    newSocket.on('joined_room', (roomId: string) => {
      console.log(`Successfully joined room: ${roomId}`);
    });

    newSocket.on('left_room', (roomId: string) => {
      console.log(`Successfully left room: ${roomId}`);
    });


    return () => {
      if (newSocket) {
        newSocket.disconnect();
        socketRef.current = null;
      }
    };
  }, [serverUrl]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_room', roomId);
    } else {
      console.warn('Socket not connected, cannot join room.');
      setError('Socket not connected. Please try again.');
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_room', roomId);
    } else {
      console.warn('Socket not connected, cannot leave room.');
    }
  };

  const sendMessage = (data: { message: string; roomId: string; userId?: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', data);
    } else {
      console.warn('Socket not connected, cannot send message.');
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
  };
};
