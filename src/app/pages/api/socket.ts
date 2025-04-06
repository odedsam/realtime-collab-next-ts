import { Server as IOServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

// Patch the res.socket.server type to include `io`
type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log('Socket.IO already running')
    return res.end()
  }

  const io = new IOServer(res.socket.server, {
    path: '/api/socket',
  })

  res.socket.server.io = io

  io.on('connection', socket => {
    console.log(' Socket connected:', socket.id)

    socket.on('message', msg => {
      console.log('💬 Message:', msg)
      socket.broadcast.emit('message', msg)
    })
  })

  console.log('Socket.IO initialized')
  res.end()
}
