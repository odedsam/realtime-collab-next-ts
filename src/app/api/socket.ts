import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('🧠 Socket.IO already running');
    res.end();
    return;
  }

  console.log('🚀 Initializing Socket.IO...');

  const io = new IOServer(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*', // remainder to put on production domain
      methods: ['GET', 'POST'],
    },
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(' Socket connected:', socket.id);

    socket.on('message', (msg) => {
      console.log('💬 Incoming message:', msg);
      socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected:', socket.id);
    });
  });

  res.end();
}
