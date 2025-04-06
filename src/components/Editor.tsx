'use client'

import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { socket } from '@/app/lib/socket-client'

type EditorProps = {
  docId: string
}

export default function Editor({ docId }: EditorProps) {
  const [loaded, setLoaded] = useState(false)
  const [initialContent, setInitialContent] = useState('<p>Loading...</p>')

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      socket.emit('message', html)
    },
  })

  // Load doc content from API
  useEffect(() => {
    const fetchDoc = async () => {
      const res = await fetch(`/api/documents/${docId}`)
      if (res.ok) {
        const data = await res.json()
        setInitialContent(data.content || '<p>New doc</p>')
        setLoaded(true)
      }
    }

    fetchDoc()
  }, [docId])

  useEffect(() => {
    if (!editor || !loaded) return

    socket.connect()

    socket.on('message', (html: string) => {
      if (html !== editor.getHTML()) {
        editor.commands.setContent(html, false)
      }
    })

    const interval = setInterval(() => {
      const html = editor.getHTML()
      fetch(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: html,
          title: 'Untitled',
        }),
      })
    }, 3000)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [editor, loaded, docId])

  if (!loaded || !editor) return <p className="text-center p-10">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <EditorContent editor={editor} />
    </div>
  )
}
