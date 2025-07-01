'use client';

import type { Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@/lib/types';
import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string>('N/A');

  useEffect(() => {
    const socketInstance = socketManager.connect();
    setSocket(socketInstance);

    const onConnect = () => {
      setIsConnected(true);
      setTransport(socketInstance.io.engine.transport.name);

      socketInstance.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport('N/A');
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketManager.disconnect();
    };
  }, []);

  return { socket, isConnected, transport };
};
