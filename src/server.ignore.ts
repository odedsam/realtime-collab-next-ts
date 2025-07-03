import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@/lib/types';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: dev ? [`http://${hostname}:${port}`] : false,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join room
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      socket.emit('joined_room', roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      socket.emit('left_room', roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // Handle messages
    socket.on('send_message', (data) => {
      const messageData = {
        id: Date.now().toString(),
        message: data.message,
        userId: data.userId,
        username: data.username,
        timestamp: new Date().toISOString(),
        roomId: data.roomId,
      };

      // Emit to room
      io.to(data.roomId).emit('receive_message', messageData);
      console.log(`Message sent to room ${data.roomId}:`, messageData);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: data.userId,
        username: data.username,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: data.userId,
        username: data.username,
        isTyping: false,
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
