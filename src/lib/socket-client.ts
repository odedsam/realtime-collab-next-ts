import { io } from 'socket.io-client'
export const socket = io({
  path: '/',
  autoConnect: false,
})
