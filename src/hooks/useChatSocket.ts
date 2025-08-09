import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '@/types';
import { API } from '@/services';
interface ReceivedMessage {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
  user?: Partial<User>;
}

interface SendMessagePayload {
  message: string;
  roomId: string;
  userId?: string;
}

export const useChatSocket = (roomId: string) => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const newSocket = io(`${API}`, { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.emit('join_room', roomId);
    newSocket.on('receive_message', (msg: ReceivedMessage) => {
      setMessages((prev) => {
        const hasTemp = prev.some(
          (m) => m.id.startsWith('temp-') && m.message === msg.message
        );
        if (hasTemp) {
          return prev.map((m) =>
            m.id.startsWith('temp-') && m.message === msg.message ? msg : m
          );
        }
        return [...prev, msg];
      });

      queryClient.setQueryData<ReceivedMessage[]>(['messages', roomId], (old = []) => {
        const hasTemp = old.some(
          (m) => m.id.startsWith('temp-') && m.message === msg.message
        );
        if (hasTemp) {
          return old.map((m) =>
            m.id.startsWith('temp-') && m.message === msg.message ? msg : m
          );
        }
        return [...old, msg];
      });
    });

    newSocket.on('join_room', (data: { roomId: string; messages: ReceivedMessage[] }) => {
      if (data?.messages) {
        setMessages(data.messages);
        queryClient.setQueryData(['messages', roomId], data.messages);
      }
    });

    return () => {
      newSocket.emit('leave_room', roomId);
      newSocket.disconnect();
    };
  }, [roomId, queryClient]);

  const sendMessage = useCallback(
    (data: SendMessagePayload) => {
      if (!socket) return;

      const optimisticMessage: ReceivedMessage = {
        id: `temp-${Date.now()}`,
        message: data.message,
        userId: data.userId ?? 'me',
        username: 'You',
        timestamp: new Date().toISOString(),
        roomId: data.roomId,
        user: { name: 'You' },
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      queryClient.setQueryData<ReceivedMessage[]>(['messages', data.roomId], (old = []) => [...old, optimisticMessage]);

      socket.emit('send_message', data);
    },
    [socket, queryClient]
  );

  return { messages, sendMessage };
};
