'use client'
import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { socket } from 'app/lib/socket-client'

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello world!</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      socket.emit('message', html)
    },
  })

  useEffect(() => {
    socket.connect()

    socket.on('message', (html: string) => {
      if (editor && html !== editor.getHTML()) {
        editor.commands.setContent(html, false)
      }
    })

    const interval = setInterval(() => {
      const html = editor?.getHTML()
      if (html) {
        fetch('/api/documents/save', {
          method: 'POST',
          body: JSON.stringify({
            content: html,
            title: 'Untitled',
            id: 'demo-doc-id-1',
          }),
        })
      }
    }, 3000)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [editor])

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <EditorContent editor={editor} />
    </div>
  )
}
