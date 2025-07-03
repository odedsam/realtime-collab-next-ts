import { test, expect } from '@playwright/test';
import { io, Socket } from 'socket.io-client';

test.describe('Socket.IO server', () => {
  let socket: Socket;

  test.beforeEach(async () => {
    socket = io('http://localhost:4000');
  });

  test.afterEach(() => {
    if (socket.connected) socket.disconnect();
  });

  test('connects and joins room', async () => {
    await new Promise<void>((resolve) => {
      socket.on('connect', () => {
        socket.emit('join_room', 'test-room');
      });

      socket.on('joined_room', (roomId) => {
        expect(roomId).toBe('test-room');
        resolve();
      });
    });
  });

  test('send and receive message', async () => {
    const testMessage = {
      message: 'Hello Playwright',
      userId: 'testUser',
      username: 'Oded',
      roomId: 'test-room',
    };

    await new Promise<void>((resolve) => {
      socket.on('connect', () => {
        socket.emit('join_room', testMessage.roomId);
      });

      socket.on('joined_room', () => {
        socket.emit('send_message', testMessage);
      });

      socket.on('receive_message', (data) => {
        expect(data.message).toBe(testMessage.message);
        expect(data.userId).toBe(testMessage.userId);
        resolve();
      });
    });
  });
});
