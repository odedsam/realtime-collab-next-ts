import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';

const httpServer = createServer();

const io = new IOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
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

  socket.on('send_message', (data) => {
    const messageData = {
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

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
