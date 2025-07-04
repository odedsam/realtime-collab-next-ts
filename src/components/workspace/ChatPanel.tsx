'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
}

interface Props {
  initialMessages: Message[];
  chatUser: string;
  chatUserName?: string;
}

export default function ChatPanel({ initialMessages, chatUser, chatUserName }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter messages to this private chat only
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === 'You' && msg.recipient === chatUser) ||
      (msg.sender === chatUser && msg.recipient === 'You')
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: String(Date.now()), sender: 'You', recipient: chatUser, content: input.trim() };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput('');
    simulateReply();
  };

  const simulateReply = () => {
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: String(Date.now() + 1),
          sender: chatUser,
          recipient: 'You',
          content: 'Got your message!',
        },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="flex flex-col flex-1 p-6 overflow-hidden border bg-zinc-900 rounded-br-2xl rounded-bl-2xl border-zinc-700">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-teal-400">
          Chat with {chatUserName || chatUser}
        </h2>
      </header>

      <div className="flex-1 px-2 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-zinc-800">
        {filteredMessages.map(({ id, sender, content }) => {
          const isUser = sender === 'You';
          return (
            <div
              key={id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              title={`${sender} says`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl break-words
                  ${isUser ? 'bg-teal-600 text-white rounded-br-none' : 'bg-zinc-700 text-gray-300 rounded-bl-none'}`}
              >
                <p className="mb-1 text-sm font-semibold">{!isUser && sender}</p>
                <p className="text-sm leading-snug">{content}</p>
                {isUser && (
                  <p className="mt-1 text-xs text-right text-gray-300">
                    You
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-3 mt-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          aria-label="Chat input"
          className="flex-grow px-4 py-3 text-sm text-gray-200 placeholder-gray-500 border rounded-md border-zinc-700 bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex items-center justify-center px-5 py-3 text-white transition bg-teal-600 rounded-md hover:bg-teal-700"
        >
          Send
        </button>
      </form>
    </section>
  );
}
