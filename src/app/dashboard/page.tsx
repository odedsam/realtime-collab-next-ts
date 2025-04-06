'use client'
import { socket } from 'app/lib/socket-client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
const newLocal = '@/components/Editor'
const Editor = dynamic(() => import(newLocal), {
  ssr: false,
}) as React.ComponentType<{ docId: string }>


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
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col gap-8 items-center">
      <h1 className="text-2xl font-bold">Real-time Dashboard</h1>

      {/* Real-Time Chat Section */}
      <div className="w-full max-w-md border rounded p-4 space-y-2 bg-white shadow h-64 overflow-y-auto">
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

      <Editor docId="demo-doc-id-1" />
    </div>
  )
}
