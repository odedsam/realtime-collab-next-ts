'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const MODELS = ['mixtral', 'gemma', 'llama3'] as const
type Model = (typeof MODELS)[number]

export default function GroqChatClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState<Model>('llama3')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages: Message[] = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:4000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model }),
      })

      const data = await res.json()
      const aiResponse = data?.content?.trim()

      if (aiResponse) {
        setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }])
      }
    } catch (err) {
      console.error('❌ Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="mx-auto flex h-[90vh] w-full max-w-2xl flex-col bg-white p-4">
      <div className="mb-2 flex gap-3">
        {MODELS.map((m) => (
          <button
            key={m}
            onClick={() => setModel(m)}
            className={`rounded-lg px-3 py-1 text-sm border ${
              model === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border p-4 shadow-inner bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 text-sm whitespace-pre-wrap ${
              msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-700'
            }`}
          >
            <span className="inline-block max-w-[80%] rounded-lg bg-white px-3 py-2 shadow">
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
