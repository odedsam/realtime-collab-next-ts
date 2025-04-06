'use client'
import { socket } from 'app/lib/socket-client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    socket.connect()

    socket.on('message', (msg: string) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input)
      setMessages(prev => [...prev, `Me: ${input}`])
      setInput('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 p-8">
      <h1 className="text-2xl font-bold">🧠 Real-time Dashboard</h1>

      <div className="w-full max-w-md border rounded p-4 space-y-2 bg-gray-50 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">{msg}</div>
        ))}
      </div>

      <div className="flex w-full max-w-md gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
