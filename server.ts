import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

interface MessageData {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
}

const httpServer = http.createServer();

const io = new IOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    socket.emit('joined_room', roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    socket.emit('left_room', roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('send_message', (data: MessageData) => {
    const messageData: MessageData = {
      id: Date.now().toString(),
      message: data.message,
      userId: data.userId,
      username: data.username,
      timestamp: new Date().toISOString(),
      roomId: data.roomId,
    };

    io.to(data.roomId).emit('receive_message', messageData);
    console.log(`Message sent to room ${data.roomId}:`, messageData);
  });

  socket.on('typing_start', (data: { roomId: string; userId: string; username: string }) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: data.userId,
      username: data.username,
      isTyping: true,
    });
  });

  socket.on('typing_stop', (data: { roomId: string; userId: string; username: string }) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: data.userId,
      username: data.username,
      isTyping: false,
    });
  });

  socket.on('disconnect', (reason: string) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
